<?php

namespace App\Http\Controllers;

use App\Models\Review;
use Illuminate\Http\Request;
use Lunar\Models\Order;

class ReviewController extends Controller
{
    public function create(Request $request)
    {
        $order = Order::where('id', $request->order)
            ->where('user_id', auth()->id())
            ->where('status', 'dispatched')
            ->firstOrFail();

        // Check if review already exists
        $existingReview = Review::where('order_id', $order->id)->first();
        if ($existingReview) {
            return redirect()->route('orders.index')
                ->with('error', 'You have already submitted a review for this order.');
        }

        return inertia('reviews/create', [
            'order' => $order->load('user'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required|exists:orders,id',
            'customer_name' => 'required|string|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);

        $order = Order::where('id', $request->order_id)
            ->where('user_id', auth()->id())
            ->where('status', 'dispatched')
            ->firstOrFail();

        // Check if review already exists
        $existingReview = Review::where('order_id', $order->id)->first();
        if ($existingReview) {
            return redirect()->route('orders.index')
                ->with('error', 'You have already submitted a review for this order.');
        }

        Review::create([
            'order_id' => $request->order_id,
            'user_id' => auth()->id(),
            'customer_name' => $request->customer_name,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return redirect()->route('orders.index')
            ->with('success', 'Review submitted successfully! It will be visible after admin approval.');
    }
}