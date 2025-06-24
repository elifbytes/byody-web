<?php

namespace App\Providers;

use App\Filament\Resources\BannerResource;
use Illuminate\Support\ServiceProvider;
use Lunar\Admin\Support\Facades\LunarPanel;
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
        //
    }
}
