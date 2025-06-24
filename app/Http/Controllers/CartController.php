<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Lunar\Facades\CartSession;
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
        $prices = $productVariant->prices;
        $currencyId = $prices->first()->currency_id ?? null;
        $channels = $productVariant->product->channels;
        $channelId = $channels->first()->id ?? null;

        $cart = Cart::where('user_id', Auth::id())->first();
        if (!$cart) {
            $cart = Cart::create([
                'currency_id' => $currencyId,
                'channel_id' => $channelId,
                'user_id' => Auth::id(),
            ]);
        }

        $quantity = $request->quantity;
        $cart->lines()->create([
            'purchasable_type' => $productVariant->getMorphClass(),
            'purchasable_id' => $productVariant->id,
            'quantity' => $quantity,
        ]);

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
}
