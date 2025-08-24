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
use Xendit\Configuration;
use Xendit\Invoice\CreateInvoiceRequest;
use Xendit\Invoice\InvoiceApi;
use App\Models\Review;
use Barryvdh\DomPDF\Facade\Pdf;

class OrderController extends Controller
{
    public function __construct()
    {
        Configuration::setXenditKey(env('XENDIT_SECRET_KEY'));
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
            $customer->load('addresses');
        }

        $cart = $cart ?: CartSession::current();
        $cart->calculate();
        $cart->calculation = [
            'total' => $cart->total,
            'subTotal' => $cart->subTotal,
            'subTotalDiscounted' => $cart->subTotalDiscounted,
            'taxTotal' => $cart->taxTotal,
            'discountTotal' => $cart->discountTotal,
            'shippingTotal' => $cart->shippingTotal,
            'discountBreakdown' => $cart->discountBreakdown,
        ];
        $cart->shippingAddress;
        $cart->shipping_option = $cart->getShippingOption();
        $shippingOptions = ShippingManifest::getOptions($cart);
        $cart->load(
            'lines.purchasable.images',
            'lines.purchasable.product.media',
            'lines.purchasable.prices',
            'lines.purchasable.values.option'
        );

        return inertia('orders/create', [
            'cart' => $cart,
            'countries' => $countries,
            'addresses' => $customer ? $customer->addresses : [],
            'shippingOptions' => $shippingOptions,
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
                // Validate stock availability before creating order
                foreach ($cart->lines as $line) {
                    $productVariant = $line->purchasable;
                    if ($productVariant instanceof ProductVariant) {
                        if ($productVariant->stock < $line->quantity) {
                            throw new \Exception("Stock untuk {$productVariant->product->translateAttribute('name')} tidak mencukupi. Stock tersedia: {$productVariant->stock}, diminta: {$line->quantity}");
                        }
                    }
                }
                
                $order = $cart->createOrder();
                // set placed_at timestamp
                $order->placed_at = now();

                // $exchangeRates = Exchange::rates('USD', ['IDR']);
                // $rates = $exchangeRates->getRates();
                // $rate = $rates['IDR'];
                // if (!$rate) {
                //     throw new \Exception('Exchange rate not available for IDR');
                // }
                $amount = $order->total->decimal;
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

                // Reduce stock for each order line after successful order creation
                foreach ($order->lines as $orderLine) {
                    if ($orderLine->purchasable_type === (new ProductVariant())->getMorphClass()) {
                        $productVariant = ProductVariant::find($orderLine->purchasable_id);
                        if ($productVariant) {
                            $productVariant->decrement('stock', $orderLine->quantity);
                        }
                    }
                }

                // Clear the cart after order is placed
                Cart::destroy($cart->id);
            });
        } catch (CartException $ce) {
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
     * Add a new customer address.
     */
    public function createAddress(Request $request)
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'country_id' => ['required', 'exists:countries,id'],
            'line_one' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'state' => ['required', 'string', 'max:100'],
            'postcode' => ['required', 'string', 'max:20'],
            'delivery_instructions' => ['nullable', 'string', 'max:255'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'contact_phone' => ['required', 'string', 'max:20', 'regex:/^\+?[0-9\s\-()]+$/'],
        ]);

        $customer = request()->user()->customers()->latest()->first();
        if ($customer) {
            $customer->addresses()->create($data);
        }

        return redirect()->back();
    }

    /**
     * Update the customer address.
     */
    public function updateAddress(Request $request, string $addressId)
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'country_id' => ['required', 'exists:countries,id'],
            'line_one' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'state' => ['required', 'string', 'max:100'],
            'postcode' => ['required', 'string', 'max:20'],
            'delivery_instructions' => ['nullable', 'string', 'max:255'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'contact_phone' => ['required', 'string', 'max:20', 'regex:/^\+?[0-9\s\-()]+$/'],
        ]);
        $customer = request()->user()->customers()->latest()->first();
        if ($customer) {
            $address = $customer->addresses()->findOrFail($addressId);
            $address->update($data);
        }
        return redirect()->back();
    }

    /**
     * Direct checkout from product pa  ge
     */
    public function directCheckout(Request $request)
    {
        $data = $request->validate([
            'product_variant_id' => ['required', 'exists:product_variants,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $productVariant = ProductVariant::findOrFail($data['product_variant_id']);
        
        // Check stock availability
        if ($productVariant->stock <= 0) {
            return redirect()->back()->withErrors(['order' => 'Stock habis, silahkan ganti dengan opsi lain']);
        }
        
        if ($data['quantity'] > $productVariant->stock) {
            return redirect()->back()->withErrors(['order' => "Stock hanya tersedia {$productVariant->stock} item"]);
        }

        $cart = Cart::create([
            'currency_id' => CartSession::getCurrency()->id,
            'channel_id' => CartSession::getChannel()->id,
            'user_id' => optional(request()->user())->id,
            'customer_id' => optional(request()->user())->latestCustomer()?->id,
        ]);

        try {   
            $cart->add($productVariant, $data['quantity']);
        } catch (\Lunar\Exceptions\Carts\CartException $e) {
            $error = $e->getMessage();
            return redirect()->back()->withErrors(['order' => $error]);
        }

        return redirect()->route('orders.create', $cart->id);
    }

    /**
     * Download order PDF
     */
    public function downloadPdf(Order $order)
    {
        // Check if user has permission to view this order
        if ($order->user_id !== Auth::id() && !Auth::user()->hasRole('admin')) {
            abort(403, 'Unauthorized access to order.');
        }

        $order->load(['lines', 'user', 'addresses', 'shipping_address', 'billing_address']);

        $pdf = Pdf::loadView('orders.pdf', compact('order'));
        
        return $pdf->download('order-' . $order->reference . '.pdf');
    }
}
