<?php

use App\Http\Controllers\Api\CountryController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\SearchController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/search/products', [SearchController::class, 'products'])->name('api.search.products');
Route::get('/countries', [CountryController::class, 'index'])->name('api.countries.index');
Route::get('/countries/{countryId}/states', [CountryController::class, 'states'])->name('api.countries.states');

// Xendit Callback
Route::post('invoice', [PaymentController::class, 'handleWebhook']);
