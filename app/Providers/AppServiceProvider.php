<?php

namespace App\Providers;

use App\Filament\Resources\BannerResource;
use Illuminate\Support\ServiceProvider;
use Lunar\Admin\Support\Facades\LunarPanel;
use Lunar\Models\Price;
use Lunar\Models\Product;
use Lunar\Shipping\ShippingPlugin;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        LunarPanel::panel(
            fn($panel) =>
            $panel
                ->path('admin')
                ->plugins([
                    new ShippingPlugin,
                ])
                ->resources([
                    BannerResource::class,
                ])->navigationGroups([
                    'Content',
                    'Catalog',
                    'Sales',
                    'Shipping',
                    'Settings',
                ])->colors([
                    'primary' => '#171717',
                    'secondary' => '#f5f5f5',
                    'success' => '#171717',
                    'danger' => '#e7000b',
                    'warning' => '#f5f5f5',
                    'info' => '#f5f5f5',
                ])

        )->register();
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Product::resolveRelationUsing(
        //     'price',
        //     function (Product $product) {
        //         return Price::query()
        //             ->join('product_variants', 'product_variants.id', '=', 'prices.priceable_id')
        //             ->wherePriceableType('product_variant')
        //             ->where('product_variants.product_id', $product->id)
        //             ->select('prices.*')
        //             ->limit(1);
        //     }
        // );
    }
}
