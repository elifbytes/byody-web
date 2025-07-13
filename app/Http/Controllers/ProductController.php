<?php

namespace App\Http\Controllers;

use App\Traits\FetchesUrls;
use Illuminate\Http\Request;
use Lunar\Models\Collection;
use Lunar\Models\Product;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class ProductController extends Controller
{
    use FetchesUrls;

    /**
     * Display a listing of the products.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');
        $searchIds = blank($search) ? [] : Product::search($search)->keys();

        $products = QueryBuilder::for(Product::class)
            ->with(['thumbnail', 'variants.prices', 'defaultUrl'])
            ->allowedFilters([
                AllowedFilter::callback('collections', function ($query, $value) {
                    $query->whereHas('collections', function ($q) use ($value) {
                        if (is_array($value)) {
                            $ids = collect($value)->map(function ($v) {
                                $url = $this->fetchUrl(
                                    $v,
                                    (new Collection())->getMorphClass()
                                );
                                return $url ? $url->id : null;
                            })->filter();
                            if ($ids->isEmpty()) {
                                return;
                            }
                            $q->whereIn('collections.id', $ids);
                            return;
                        }

                        $url = $this->fetchUrl(
                            $value,
                            (new Collection())->getMorphClass()
                        );
                        if (! $url) {
                            return;
                        }
                        $q->where('collections.id', $url->id);
                    });
                }),
                AllowedFilter::callback('availability', function ($query, $value) {
                    if ($value === 'in-stock') {
                        $query->whereHas('variants', function ($q) {
                            $q->where('deleted_at', null)
                                ->where('stock', '>', 0);
                        });
                    } elseif ($value === 'all') {
                        // No additional filter needed for 'all'
                    } else {
                        // Handle other cases if necessary
                    }
                }),
                AllowedFilter::callback('min_price', function ($query, $value) {
                    $query->whereHas('variants.prices', function ($q) use ($value) {
                        $decimalPlaces = env('APP_CURRENCY_DECIMAL_PLACES', 2);
                        $factor = pow(10, $decimalPlaces);
                        $value = round($value * $factor);
                        $q->where('price', '>=', $value);
                    });
                }),
                AllowedFilter::callback('max_price', function ($query, $value) {
                    $query->whereHas('variants.prices', function ($q) use ($value) {
                        $decimalPlaces = env('APP_CURRENCY_DECIMAL_PLACES', 2);
                        $factor = pow(10, $decimalPlaces);
                        $value = round($value * $factor);
                        $q->where('price', '<=', $value);
                    });
                }),
            ])
            ->tap(function ($query) use ($searchIds) {
                return empty($searchIds) ? $query : $query->whereIn('id', $searchIds);
            })
            ->paginate()
            ->appends(request()->query());

        $filters = $request->all()['filter'] ?? [];
        $sort = $request->all()['sort'] ?? [];

        return inertia('products/index', [
            'products' => $products,
            'search' => $search,
            'filters' => $filters,
            'sort' => $sort,
        ]);
    }

    /**
     * Display the specified product.
     */
    public function show(string $slug)
    {
        $url = $this->fetchUrl(
            $slug,
            (new Product())->getMorphClass(),
            [
                'element.media',
                'element.variants.values.option',
                'element.variants.images',
                'element.variants.prices',
            ]
        );

        if (! $url) {
            abort(404);
        }

        $product = $url->element;

        return inertia('products/show', [
            'product' => $product,
        ]);
    }

    public function search(string $query)
    {
        $products = Product::search($query)
            ->with([
                'element.media',
                'element.variants.values.option',
                'element.variants.images',
            ])
            ->get();

        return inertia('search', [
            'products' => $products,
            'query' => $query,
        ]);
    }
}
