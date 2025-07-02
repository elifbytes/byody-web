<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Laravel\WorkOS\Http\Middleware\ValidateSessionWithWorkOS;

Route::get('/', HomeController::class)->name('home');
Route::get('product/{slug}', [ProductController::class, 'show'])->name('product.show');
Route::resource('cart', CartController::class);

Route::middleware([
    'auth',
    ValidateSessionWithWorkOS::class,
])->group(function () {
    Route::resource('order', OrderController::class);
    
    Route::put('cart/set-address/{addressId}', [CartController::class, 'setAddress'])->name('cart.set-address');
    Route::put('cart/set-shipping-option/{identifier}', [CartController::class, 'setShippingOption'])->name('cart.set-shipping-option');

    Route::post('customer/update', [ProfileController::class, 'updateCustomer'])->name('customer.profile.update');

});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
