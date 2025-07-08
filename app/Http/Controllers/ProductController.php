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

        $collections = Collection::with(['defaultUrl'])->get()->toTree();
        $products = QueryBuilder::for(Product::class)
            ->with(['thumbnail'])
            ->allowedFilters([
                AllowedFilter::callback('collections', function ($query, $value) {
                    $query->whereHas('collections', function ($q) use ($value) {
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
            ])
            ->tap(function ($query) use ($searchIds) {
                return empty($searchIds) ? $query : $query->whereIn('id', $searchIds);
            })
            ->paginate(12);

        return inertia('products/index', [
            'products' => $products,
            'collections' => $collections,
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
