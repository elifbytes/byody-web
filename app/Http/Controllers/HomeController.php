<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\Review;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;
use Lunar\Models\Collection;
use Lunar\Models\Product;
use Lunar\Models\ProductVariant;

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
            ->whereType('physical')

            ->groupBy('products.id')
            ->orderByRaw('COUNT(order_lines.id) DESC')
            
            ->take(10)
            ->get();

        $collections = Collection::with('thumbnail')->get();
        
        // Get approved reviews
        $reviews = Review::approved()
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($review) {
                return [
                    'name' => $review->customer_name,
                    'stars' => $review->rating,
                    'comment' => $review->comment,
                    'date' => $review->created_at->format('Y-m-d'),
                ];
            });

        return inertia('home', [
            'banners' => $banners,
            'newArrivals' => $newArrivals,
            'bestSellers' => $bestSellers,
            'collections' => $collections,
            'reviews' => $reviews,
            
        ]);
    }
}