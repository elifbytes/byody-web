<?php

use Illuminate\Support\Facades\Route;
use Laravel\WorkOS\Http\Requests\AuthKitAuthenticationRequest;
use Laravel\WorkOS\Http\Requests\AuthKitLoginRequest;
use Laravel\WorkOS\Http\Requests\AuthKitLogoutRequest;

Route::get('login', function (AuthKitLoginRequest $request) {
    $referer = $request->headers->get('referer');
    $request->session()->flash('referer', $referer);
    return $request->redirect();
})->middleware(['guest'])->name('login');

Route::get('authenticate', function (AuthKitAuthenticationRequest $request) {
    return tap(redirect(
        session('referer', '/')
    ), fn() => $request->authenticate());
})->middleware(['guest']);

Route::post('logout', function (AuthKitLogoutRequest $request) {
    return $request->logout();
})->middleware(['auth'])->name('logout');
