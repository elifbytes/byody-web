<?php

namespace App\QueryBuilder\Sorts;

use Spatie\QueryBuilder\Sorts\Sort;
use Illuminate\Database\Eloquent\Builder;
use Lunar\Models\ProductVariant;

class ProductPriceSort implements Sort
{
    public function __invoke(Builder $query, bool $descending, string $property)
    {
        $direction = $descending ? 'DESC' : 'ASC';

        $query
            ->join('product_variants', 'products.id', '=', 'product_variants.product_id')
            ->join('prices', function ($join) {
                $join->on('product_variants.id', '=', 'prices.priceable_id')
                    ->where('prices.priceable_type', (new ProductVariant())->getMorphClass());
            })
            ->selectRaw('products.*')
            ->selectRaw('MIN(prices.price) as min_price')
            ->groupBy('products.id')
            ->orderBy('min_price', $direction);
    }
}
