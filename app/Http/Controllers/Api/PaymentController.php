<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Lunar\Models\Order;

class PaymentController extends Controller
{
    public function handleWebhook(Request $request)
    {
        $callback_token = $request->header('x-callback-token');

        if ($callback_token !== config('services.xendit.callback_token')) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }
        $data = $request->all();
        $external_id = $data['external_id'];
        $status = $data['status'];
        $payment_method = $data['payment_method'];

        $order = Order::where('reference', $external_id)->first();

        if (!$order) {
            return response()->json([
                'message' => 'Order not found',
            ], 404);
        }
        if ($status === 'PAID') {
            $order->status = 'payment-received';
        }
        $order->save();

        $order->transactions()->create([
            'success' => $status === 'PAID',
            'type' => 'capture',
            'driver' => 'xendit',
            'amount' => $order->total,
            'reference' => $data['id'],
            'status' => $status,
            'card_type' => $payment_method
        ]);

        return response()->json([
            'message' => 'Webhook received',
            'status' => $status,
            'payment_method' => $payment_method,
        ]);
    }
}
