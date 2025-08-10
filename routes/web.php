<?php

use App\Http\Controllers\CartController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\ReviewController;
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
    Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('orders/create/{cart?}', [OrderController::class, 'create'])->name('orders.create');
    Route::post('orders', [OrderController::class, 'store'])->name('orders.store');
    Route::post('orders/direct-checkout', [OrderController::class, 'directCheckout'])->name('orders.direct-checkout');

    Route::put('carts/set-address/{addressId}/{cart?}', [CartController::class, 'setAddress'])->name('carts.set-address');
    Route::put('carts/set-shipping-option/{identifier}/{cart?}', [CartController::class, 'setShippingOption'])->name('carts.set-shipping-option');
    Route::post('carts/apply-voucher', [CartController::class, 'applyVoucher'])->name('carts.apply-voucher');

    Route::post('customers/update', [ProfileController::class, 'updateCustomer'])->name('customers.profile.update');

    Route::get('/reviews/create', [ReviewController::class, 'create'])->name('reviews.create');
    Route::post('/reviews', [ReviewController::class, 'store'])->name('reviews.store');
});

Route::get('/about', function () {
    return Inertia::render('about');
});

// Tambahkan route untuk FAQ dan Terms of Service
Route::get('/faqs', function () {
    return Inertia::render('faqs');
})->name('faqs');

Route::get('/terms-of-service', function () {
    return Inertia::render('terms-of-service');
})->name('terms-of-service');

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
