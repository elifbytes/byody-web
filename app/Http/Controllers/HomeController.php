<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Lunar\Models\Collection;
use Lunar\Models\OrderLine;
use Lunar\Models\Product;

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

        $newArrivals = Product::with(['thumbnail'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        foreach ($newArrivals as $product) {
            $product->price = $product->prices->first()->price->formatted() ?? null;
        }

        $collections = Collection::query()
            ->with(['products', 'thumbnail'])
            ->orderBy('_lft')
            ->get();

        // $bestSellers = OrderLine::query()->with(['currency'])->whereHas('order', function ($relation) {
        //     $relation->whereBetween('placed_at', [
        //         now()->subYear()->startOfDay(),
        //         now()->endOfDay(),
        //     ]);
        // })->select(
        //     DB::RAW('MAX(id) as id'),
        //     DB::RAW('MAX(order_id) as order_id'),
        //     DB::RAW('COUNT(id) as quantity'),
        //     DB::RAW('SUM(sub_total) as sub_total'),
        //     DB::RAW('MAX(description) as description'),
        //     'identifier',
        // )->groupBy('identifier', 'purchasable_id')
        //     ->whereType('physical')
        //     ->orderBy('quantity', 'desc')
        //     ->take(10)
        //     ->get();

        return inertia('home', [
            'banners' => $banners,
            'newArrivals' => $newArrivals,
            'collections' => $collections,
        ]);
    }
}
