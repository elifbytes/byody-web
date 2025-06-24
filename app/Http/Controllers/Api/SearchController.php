<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Lunar\Models\Product;

class SearchController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function products(Request $request)
    {
        $query = $request->input('query');

        if (!$query) {
            return response()->json(['error' => 'Query parameter is required'], 400);
        }

        $products = Product::search($query)
            ->query(fn(Builder $query) => $query->with('thumbnail', 'defaultUrl')->limit(10))
            ->get();

        foreach ($products as $product) {
            $product->price = $product->prices->first()->price->formatted() ?? null;
        }

        return $products;
    }
}
