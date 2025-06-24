<?php

namespace App\Http\Controllers;

use App\Traits\FetchesUrls;
use Illuminate\Http\Request;
use Lunar\Models\Product;

class ProductController extends Controller
{
    use FetchesUrls;

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
}
