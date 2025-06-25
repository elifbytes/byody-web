<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use Illuminate\Database\Query\JoinClause;
use Illuminate\Support\Facades\DB;
use Lunar\Facades\Pricing;
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

        $newArrivals = Product::with(['thumbnail', 'defaultUrl'])
            ->join('product_variants', 'products.id', '=', 'product_variants.product_id')
            ->join('prices', function (JoinClause $join) {
                $join->on('product_variants.id', '=', 'prices.priceable_id')
                    ->where('prices.priceable_type', (new ProductVariant)->getMorphClass());
            })
            ->join('currencies', 'prices.currency_id', '=', 'currencies.id')
            ->select(
                'products.*',
                DB::raw(
                    'TRUNC(
                        (MIN(prices.price) / POWER(10, MIN(currencies.decimal_places))::NUMERIC
                    ), 2) as price'
                )
            )
            ->groupBy('products.id')
            ->orderBy('products.created_at', 'desc')
            ->take(10)
            ->get();

        // foreach ($newArrivals as $product) {
        //     $product->price = Pricing::for($product->variants->first())->get()->base->price->formatted();
        // }

        $collections = Collection::query()
            ->with(['products', 'thumbnail'])
            ->orderBy('_lft')
            ->get();

        $bestSellers = Product::query()
            ->with(['thumbnail', 'defaultUrl', 'variants'])
            ->join('product_variants', 'products.id', '=', 'product_variants.product_id')
            ->join('order_lines', 'product_variants.id', '=', 'order_lines.purchasable_id')
            ->join('prices', function (JoinClause $join) {
                $join->on('product_variants.id', '=', 'prices.priceable_id')
                    ->where('prices.priceable_type', (new ProductVariant)->getMorphClass());
            })
            ->join('currencies', 'prices.currency_id', '=', 'currencies.id')
            ->select(
                'products.*',
                DB::raw(
                    'TRUNC(
                        (MIN(prices.price) / POWER(10, MIN(currencies.decimal_places))::NUMERIC
                    ), 2) as price'
                )
            )
            ->whereType('physical')
            ->groupBy('products.id')
            ->orderByRaw('COUNT(order_lines.id) DESC')
            ->take(10)
            ->get();

        return inertia('home', [
            'banners' => $banners,
            'newArrivals' => $newArrivals,
            'collections' => $collections,
            'bestSellers' => $bestSellers,
        ]);
    }
}
