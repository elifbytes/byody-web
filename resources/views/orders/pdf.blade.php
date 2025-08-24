<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order #{{ $order->reference }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            font-size: 14px;
            line-height: 1.4;
        }
        .header {
            text-align: center;
            margin-bottom: 40px;
        }
        .company-name {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }
        .invoice-title {
            font-size: 18px;
            color: #666;
        }
        .order-info {
            display: table;
            width: 100%;
            margin-bottom: 30px;
        }
        .order-info-left,
        .order-info-right {
            display: table-cell;
            width: 50%;
            vertical-align: top;
        }
        .order-info-right {
            text-align: right;
        }
        .section-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
            border-bottom: 2px solid #333;
            padding-bottom: 5px;
        }
        .info-block {
            margin-bottom: 20px;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .table th,
        .table td {
            border: 1px solid #ddd;
            padding: 12px 8px;
            text-align: left;
        }
        .table th {
            background-color: #f8f9fa;
            font-weight: bold;
        }
        .table .text-right {
            text-align: right;
        }
        .totals {
            margin-left: auto;
            width: 300px;
        }
        .totals table {
            width: 100%;
        }
        .totals td {
            border: none;
            padding: 5px 0;
        }
        .totals .total-row {
            font-weight: bold;
            font-size: 16px;
            border-top: 2px solid #333;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-awaiting-payment {
            background-color: #f8f9fa;
            color: #6c757d;
        }
        .status-payment-received {
            background-color: #d4edda;
            color: #155724;
        }
        .status-payment-offline {
            background-color: #fff3cd;
            color: #856404;
        }
        .status-dispatched {
            background-color: #d1ecf1;
            color: #0c5460;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">Byody</div>
        <div class="invoice-title">Order Invoice</div>
    </div>

    <div class="order-info">
        <div class="order-info-left">
            <div class="info-block">
                <div class="section-title">Order Details</div>
                <strong>Order #:</strong> {{ $order->reference }}<br>
                <strong>Status:</strong> 
                <span class="status-badge status-{{ $order->status }}">
                    {{ ucwords(str_replace('-', ' ', $order->status)) }}
                </span><br>
                <strong>Order Date:</strong> {{ $order->placed_at ? $order->placed_at->format('d M Y, H:i') : $order->created_at->format('d M Y, H:i') }}<br>
            </div>

            @if($order->user)
            <div class="info-block">
                <div class="section-title">Customer Information</div>
                <strong>Name:</strong> {{ $order->user->name }}<br>
                <strong>Email:</strong> {{ $order->user->email }}<br>
            </div>
            @endif
        </div>

        <div class="order-info-right">
            @if($order->shipping_address)
            <div class="info-block">
                <div class="section-title">Shipping Address</div>
                {{ $order->shipping_address->first_name }} {{ $order->shipping_address->last_name }}<br>
                {{ $order->shipping_address->line_one }}<br>
                @if($order->shipping_address->line_two)
                {{ $order->shipping_address->line_two }}<br>
                @endif
                {{ $order->shipping_address->city }}, {{ $order->shipping_address->state }} {{ $order->shipping_address->postcode }}<br>
                @if($order->shipping_address->contact_phone)
                <strong>Phone:</strong> {{ $order->shipping_address->contact_phone }}<br>
                @endif
                @if($order->shipping_address->contact_email)
                <strong>Email:</strong> {{ $order->shipping_address->contact_email }}<br>
                @endif
            </div>
            @endif
        </div>
    </div>

    <div class="section-title">Order Items</div>
    <table class="table">
        <thead>
            <tr>
                <th>Product</th>
                <th class="text-right">Quantity</th>
                <th class="text-right">Unit Price</th>
                <th class="text-right">Total</th>
            </tr>
        </thead>
        <tbody>
            @foreach($order->lines as $line)
            <tr>
                <td>{{ $line->description }}</td>
                <td class="text-right">{{ $line->quantity }}</td>
                <td class="text-right">IDR {{ number_format((is_object($line->unit_price) ? $line->unit_price->value : $line->unit_price), 0, ',', '.') }}</td>
                <td class="text-right">IDR {{ number_format((is_object($line->total) ? $line->total->value : $line->total), 0, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totals">
        <table>
            <tr>
                <td>Subtotal:</td>
                <td class="text-right">IDR {{ number_format((is_object($order->sub_total) ? $order->sub_total->value : $order->sub_total), 0, ',', '.') }}</td>
            </tr>
            @if($order->discount_total > 0)
            <tr>
                <td>Discount:</td>
                <td class="text-right">-IDR {{ number_format((is_object($order->discount_total) ? $order->discount_total->value : $order->discount_total), 0, ',', '.') }}</td>
            </tr>
            @endif
            @if($order->shipping_total > 0)
            <tr>
                <td>Shipping:</td>
                <td class="text-right">IDR {{ number_format((is_object($order->shipping_total) ? $order->shipping_total->value : $order->shipping_total), 0, ',', '.') }}</td>
            </tr>
            @endif
            @if($order->tax_total > 0)
            <tr>
                <td>Tax:</td>
                <td class="text-right">IDR {{ number_format((is_object($order->tax_total) ? $order->tax_total->value : $order->tax_total), 0, ',', '.') }}</td>
            </tr>
            @endif
            <tr class="total-row">
                <td>Total:</td>
                <td class="text-right">IDR {{ number_format((is_object($order->total) ? $order->total->value : $order->total), 0, ',', '.') }}</td>
            </tr>
        </table>
    </div>

    @if($order->notes)
    <div class="info-block">
        <div class="section-title">Order Notes</div>
        {{ $order->notes }}
    </div>
    @endif

    <div class="footer">
        <p>Thank you for your order!</p>
        <p>For any questions, please contact our customer support.</p>
    </div>
</body>
</html>
