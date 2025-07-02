<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Lunar\Exceptions\Carts\CartException;
use Lunar\Facades\CartSession;
use Lunar\Facades\ShippingManifest;
use Lunar\Models\Country;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = request()->user()->orders()->with(['addresses', 'items'])->latest()->get();

        return inertia('order/index', [
            'orders' => $orders
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $countries = Country::all();
        $customer = request()->user()->customers()->latest()->first();
        if ($customer) {
            $customer->load('addresses');
        }

        $cart = CartSession::current();
        $cart->calculation = [
            'total' => $cart->total,
            'subTotal' => $cart->subTotal,
            'subTotalDiscounted' => $cart->subTotalDiscounted,
            'taxTotal' => $cart->taxTotal,
            'discountTotal' => $cart->discountTotal,
            'shippingTotal' => $cart->shippingTotal,
        ];
        $cart->shippingAddress;
        $cart->shipping_option = $cart->getShippingOption();
        $shippingOptions = ShippingManifest::getOptions($cart);
        $cart->load('lines.purchasable.product.thumbnail', 'lines.purchasable.prices', 'lines.purchasable.values');

        return inertia('order/create', [
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
            $cart = CartSession::current();
            $cart->createOrder();

            CartSession::forget();
        } catch (CartException $ce) {
            return redirect()->back()->withErrors(['cart' => $ce->getMessage()]);
        }

        return redirect()->route('order.index');
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
}
