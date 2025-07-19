<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;
use Laravel\WorkOS\Http\Middleware\ValidateSessionWithWorkOS;
use Inertia\Inertia;

Route::get('/', HomeController::class)->name('home');
Route::get('products/{slug}', [ProductController::class, 'show'])->name('products.show');
Route::get('products', [ProductController::class, 'index'])->name('products.index');
Route::resource('carts', CartController::class);

Route::middleware([
    'auth',
    ValidateSessionWithWorkOS::class,
])->group(function () {
    Route::resource('orders', OrderController::class);
    
    Route::put('carts/set-address/{addressId}', [CartController::class, 'setAddress'])->name('carts.set-address');
    Route::put('carts/set-shipping-option/{identifier}', [CartController::class, 'setShippingOption'])->name('carts.set-shipping-option');

    Route::post('customers/update', [ProfileController::class, 'updateCustomer'])->name('customers.profile.update');
    // Tambahkan route ini di bagian routes yang sesuai
    Route::post('orders/direct-checkout', [OrderController::class, 'directCheckout'])->name('orders.direct-checkout');
});
Route::get('/about', function () {
    return Inertia::render('about');
});
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
