<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Lunar\Facades\CartSession;
use Lunar\Facades\ShippingManifest;
use Lunar\Models\Cart;
use Lunar\Models\ProductVariant;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_variant_id' => 'required|exists:product_variants,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $productVariant = ProductVariant::findOrFail($request->product_variant_id);
        $quantity = $request->quantity;
        CartSession::manager()->add($productVariant, $quantity);

        return redirect()->back()->with('success', 'Product added to cart successfully.');
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
    public function update(Request $request, Cart $cart)
    {
        $request->validate([
            'cart_line_id' => 'required|exists:cart_lines,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $cart->updateLine($request->cart_line_id, $request->quantity);

        return redirect()->back()->with('success', 'Cart updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cart $cart, Request $request)
    {
        $request->validate([
            'cart_line_id' => 'required|exists:cart_lines,id',
        ]);

        $cart->remove($request->cart_line_id);

        return redirect()->back()->with('success', 'Item removed from cart successfully.');
    }

    /**
     * Set the shipping and biling address for the cart.
     */
    public function setAddress(string $addressId)
    {
        $cart = CartSession::current();
        /** @var \App\Models\User */
        $user = Auth::user();
        $customer = $user->customers()->latest()->first();
        $address = $customer->addresses()->findOrFail($addressId);
        if (!$address) {
            throw new ValidationException('Address not found.');
        }
        $address['meta'] = [
            'address_id' => $address->id,
        ];
        $cart->setShippingAddress($address);
        $cart->setBillingAddress($address);

        return redirect()->back();
    }

    /**
     * Set the shipping option for the cart.
     */
    public function setShippingOption(string $identifier)
    {
        $cart = CartSession::current();

        $shippingOptions = ShippingManifest::getOptions($cart);

        /** @var \Lunar\DataTypes\ShippingOption|null */
        $shippingOption = collect($shippingOptions)->firstWhere('identifier', $identifier);
        if (!$shippingOption) {
            throw new ValidationException('Shipping option not found.');
        }
        $cart->setShippingOption($shippingOption);

        return redirect()->back()->with('success', 'Shipping option set successfully.');
    }
}
