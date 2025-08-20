<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\Review;
use Lunar\Models\Product;

class HomeController extends Controller
{
    public function __invoke()
    {
        $banners = Banner::with(['thumbnail'])
            ->orderBy('order_column')
            ->get();

        $newArrivals = Product::with(['thumbnail', 'defaultUrl', 'variants.prices', 'variants.images', 'media'])
            ->where('status', 'published')
            ->orderBy('products.created_at', 'desc')
            ->take(10)
            ->get();

        $bestSellers = Product::query()
            ->with(['thumbnail', 'defaultUrl', 'variants.prices'])
            ->join('product_variants', 'products.id', '=', 'product_variants.product_id')
            ->join('order_lines', 'product_variants.id', '=', 'order_lines.purchasable_id')
            ->select('products.*')
            ->where('products.status', 'published')
            ->groupBy('products.id')
            ->orderByRaw('COUNT(order_lines.id) DESC')
            ->take(10)
            ->get();

        // Get approved reviews
        $reviews = Review::approved()
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return inertia('home', [
            'banners' => $banners,
            'newArrivals' => $newArrivals,
            'bestSellers' => $bestSellers,
            'reviews' => $reviews,
        ]);
    }

    public function setCurrency(string $code)
    {
        // Validate the currency
        if (!in_array($code, ['USD', 'IDR'])) {
            abort(400, 'Unsupported currency');
        }
        session(['currency' => $code]);

        return redirect()->back();
    }
}
