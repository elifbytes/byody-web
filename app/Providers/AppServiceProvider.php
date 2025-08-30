<?php

namespace App\Providers;

use App\Filament\Resources\BannerResource;
use App\Lunar\EditOrderExtension;
use App\Modifiers\CustomShippingModifier;
use App\PaymentTypes\XenditPayment;
use Illuminate\Support\ServiceProvider;
use Lunar\Admin\Filament\Resources\OrderResource\Pages\ManageOrder;
use Lunar\Admin\Support\Facades\LunarPanel;
use Lunar\Base\ShippingModifiers;
use Lunar\Facades\ModelManifest;
use Lunar\Facades\Payments;
use App\Filament\Resources\ReviewResource;
use Lunar\Models\Contracts\Price;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        Payments::extend('xendit', function () {
            return new XenditPayment();
        });

        LunarPanel::panel(
            fn($panel) => $panel
                ->path('admin')
                ->resources([
                    BannerResource::class,
                    ReviewResource::class, // Add this line
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
        )->extensions([
            ManageOrder::class => EditOrderExtension::class,
        ])->register();
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(ShippingModifiers $shippingModifiers): void
    {
        ModelManifest::replace(
            Price::class,
            \App\Models\Price::class,
        );

        $shippingModifiers->add(
            CustomShippingModifier::class
        );
    }
}
