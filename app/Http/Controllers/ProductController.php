<?php

namespace App\Http\Controllers;

use App\Traits\FetchesUrls;
use Illuminate\Http\Request;
use Lunar\Models\Product;
use Spatie\QueryBuilder\QueryBuilder;

class ProductController extends Controller
{
    use FetchesUrls;

    /**
     * Display a listing of the products.
     */
    public function index(Request $request)
    {
        
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
            ]
        );

        if (! $url) {
            abort(404);
        }

        $product = $url->element;
        $product->price = $product->prices->first()->price->formatted() ?? null;

        return inertia('product', [
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
