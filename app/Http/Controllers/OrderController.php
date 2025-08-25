<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Lunar\Exceptions\Carts\CartException;
use Lunar\Facades\CartSession;
use Lunar\Facades\ShippingManifest;
use Lunar\Models\Cart;
use Lunar\Models\Country;
use Lunar\Models\Order;
use Lunar\Models\ProductVariant;
use Throwable;
use Xendit\Configuration;
use Xendit\Invoice\CreateInvoiceRequest;
use Xendit\Invoice\InvoiceApi;
use App\Models\Review;

class OrderController extends Controller
{
    public function __construct()
    {
        Configuration::setXenditKey(config('services.xendit.secret_key'));
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        // Get orders that already have reviews
        $orderReviews = Review::whereIn('order_id', $orders->pluck('id'))
            ->pluck('order_id')
            ->mapWithKeys(fn($orderId) => [$orderId => true])
            ->toArray();

        return inertia('orders/index', [
            'orders' => $orders,
            'orderReviews' => $orderReviews,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Cart $cart = null)
    {
        $countries = Country::all();
        $customer = request()->user()->latestCustomer();
        if ($customer) {
            $customer->load('addresses.country');
        }

        $cart = $cart ?: CartSession::current();
        // ensure the cart belongs to the current user
        $user = request()->user();
        if ($cart->user_id !== $user->id) {
            abort(403, 'Unauthorized action.');
        }
        $shippingOptions = ShippingManifest::getOptions($cart);
        $cartShippingOption = $cart->getShippingOption();

        $cart->calculate();
        $cartCalculation = [
            'total' => $cart->total,
            'subTotal' => $cart->subTotal,
            'subTotalDiscounted' => $cart->subTotalDiscounted,
            'taxTotal' => $cart->taxTotal,
            'discountTotal' => $cart->discountTotal,
            'shippingTotal' => $cart->shippingTotal,
            'discountBreakdown' => $cart->discountBreakdown,
        ];
        $cart->load([
            'lines.purchasable.images',
            'lines.purchasable.product.media',
            'lines.purchasable.prices',
            'lines.purchasable.values.option'
        ]);

        return inertia('orders/create', [
            'cart' => $cart,
            'countries' => $countries,
            'addresses' => $customer ? $customer->addresses : [],
            'shippingOptions' => $shippingOptions,
            'cartCalculation' => $cartCalculation,
            'cartShippingOption' => $cartShippingOption,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $data = $request->validate([
                'cart_id' => 'nullable|exists:carts,id',
            ]);

            $cart = Cart::find($data['cart_id']) ?: CartSession::current();

            DB::transaction(function () use ($cart) {
                // TODO: Validate if stock is available
                $order = $cart->createOrder();
                // set placed_at timestamp
                $order->placed_at = now();

                $amount = $order->total->decimal();
                $createInvoice = new CreateInvoiceRequest([
                    'external_id' => $order->reference,
                    'amount' => $amount,
                    'invoice_duration' => 172800,
                    'payer_email' => $order->billingAddress->contact_email,
                    'description' => 'Order #' . $order->reference,
                ]);
                $apiInstance = new InvoiceApi();
                $generateInvoice = $apiInstance->createInvoice($createInvoice);
                $order->meta = [
                    'invoice_id' => $generateInvoice->getId(),
                    'invoice_url' => $generateInvoice->getInvoiceUrl(),
                    'amount' => $amount,
                    'currency' => 'IDR',
                ];
                $order->save();

                // Clear the cart after order is placed
                Cart::destroy($cart->id);
            });
        } catch (CartException|Throwable $ce) {
            return redirect()->back()->withErrors(['cart' => $ce->getMessage()]);
        }

        return redirect()->route('orders.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

    /**
     * Direct checkout from product page
     */
    public function directCheckout(Request $request)
    {
        $data = $request->validate([
            'product_variant_id' => ['required', 'exists:product_variants,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $productVariant = ProductVariant::find($data['product_variant_id']);
        if (!$productVariant) {
            return redirect()->back()->withErrors(['product_variant_id' => 'Product variant not found.']);
        }

        /** @var Cart $cart */
        $cart = Cart::create([
            'currency_id' => CartSession::getCurrency()->id,
            'channel_id' => CartSession::getChannel()->id,
            'user_id' => optional(request()->user())->id,
            'customer_id' => optional(request()->user())->latestCustomer()?->id,
        ]);

        $cart->add($productVariant, $data['quantity']);

        return redirect()->route('orders.create', $cart->id);
    }
}
