<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;
use Lunar\Models\Collection;
use Lunar\Models\Product;
use Lunar\Models\ProductVariant;

class HomeController extends Controller
{
    /**
     * Handle the incoming request.
     */
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

        $bestSellerIds = DB::table('products')
            ->join('product_variants', 'products.id', '=', 'product_variants.product_id')
            ->join('order_lines', 'product_variants.id', '=', 'order_lines.purchasable_id')
            ->select('products.id')
            ->where('products.status', 'published')
            ->where('product_variants.shippable', true)
            ->whereNull('products.deleted_at')
            ->groupBy('products.id')
            ->orderByRaw('COUNT(order_lines.id) DESC')
            ->take(10)
            ->pluck('id');

        $bestSellers = collect();
        if ($bestSellerIds->isNotEmpty()) {
            $bestSellers = Product::query()
                ->with(['thumbnail', 'defaultUrl', 'variants.prices', 'variants.images', 'media'])
                ->whereIn('id', $bestSellerIds)
                ->orderByRaw('FIELD(id, ' . $bestSellerIds->implode(',') . ')')
                ->get();
        }

        $collections = Collection::with(['thumbnail', 'defaultUrl'])
            ->take(10)
            ->get();

        return inertia('home', [
            'banners' => $banners,
            'newArrivals' => $newArrivals,
            'bestSellers' => $bestSellers,
            'collections' => $collections,
        ]);
    }
}
