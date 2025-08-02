<?php

namespace App\Providers;

use App\Filament\Resources\BannerResource;
use App\Filament\Pages\Dashboard; // Updated import
use Illuminate\Support\ServiceProvider;
use Lunar\Admin\Support\Facades\LunarPanel;
use Lunar\Facades\Payments;
use Lunar\Shipping\ShippingPlugin;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        Payments::extend('xendit', function () {
            return new \App\PaymentTypes\XenditPayment();
        });
        
        LunarPanel::panel(
            fn($panel) =>
            $panel
                ->path('admin')
                ->plugins([
                    new ShippingPlugin,
                ])
                ->resources([
                    BannerResource::class,
                ])
                // Tambahkan dashboard custom melalui method pages()
                ->pages([
                    Dashboard::class, // Register custom dashboard here
                ])
                ->navigationGroups([
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
        \Lunar\Facades\ModelManifest::replace(
            \Lunar\Models\Contracts\Price::class,
            \App\Models\Price::class,
        );
    }
}
