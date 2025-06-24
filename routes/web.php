<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\WorkOS\Http\Middleware\ValidateSessionWithWorkOS;

Route::get('/', HomeController::class)->name('home');
Route::get('product/{slug}', [ProductController::class, 'show'])->name('product.show');

Route::middleware([
    'auth',
    ValidateSessionWithWorkOS::class,
])->group(function () {
    Route::resource('cart', CartController::class);
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
