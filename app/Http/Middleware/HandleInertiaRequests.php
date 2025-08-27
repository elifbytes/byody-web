<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Lunar\Facades\CartSession;
use Lunar\Models\Collection;
use Tighten\Ziggy\Ziggy;
use Worksome\Exchange\Facades\Exchange;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $collections = Collection::with(['thumbnail', 'defaultUrl'])->orderBy('_lft')->get()->toTree();
        $cart = CartSession::current(calculate: false);

        $currency = session('currency', config('app.currency'));

        if ($currency == 'IDR') {
            $rate = 1; // Default to 1 if IDR is selected
        } else {
            $exchangeRates = Exchange::rates('USD', ['IDR']);
            $rates = $exchangeRates->getRates();
            $rate = $rates['IDR'];
        }

        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => fn(): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'collections' => $collections,
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'false',
            'cart' => $cart,
            'exchangeRate' => $rate,
            'currency' => $currency,
            'quote' => ['message' => trim($message), 'author' => trim($author)],
        ];
    }
}
