<?php

namespace App\Providers;

use App\Services\SaitransService;
use Illuminate\Support\ServiceProvider;

class SaitransServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton('App\Services\SaitransService', function () {
            return new SaitransService();
        });
    }

    public function boot(): void
    {
    }
}
