<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Lunar\Exceptions\Carts\CartException;
use Lunar\Facades\CartSession;
use Lunar\Facades\ShippingManifest;
use Lunar\Models\Cart;
use Lunar\Models\Country;
use Lunar\Models\ProductVariant;
use Worksome\Exchange\Facades\Exchange;
use Xendit\Configuration;
use Xendit\Invoice\CreateInvoiceRequest;
use Xendit\Invoice\InvoiceApi;

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
        $orders = request()->user()->orders()->with(['addresses'])->latest()->get();

        return inertia('orders/index', [
            'orders' => $orders
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
        $cart->load('lines.purchasable.product.thumbnail', 'lines.purchasable.prices', 'lines.purchasable.values');

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
                // TODO: Validate if stock is available
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
     * Direct checkout from product page
     */
    public function directCheckout(Request $request)
    {
        $data = $request->validate([
            'product_variant_id' => ['required', 'exists:product_variants,id'],
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $productVariant = ProductVariant::findOrFail($data['product_variant_id']);

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
}
