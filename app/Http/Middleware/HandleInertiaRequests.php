<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Lunar\Models\Collection;
use Lunar\Models\CollectionGroup;
use Tighten\Ziggy\Ziggy;

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
        $user = $request->user();
        if ($user) {
            $cart = $user->carts()->first();
            if ($cart) {
                $cart->load(['lines.purchasable.product.thumbnail', 'lines.purchasable.values']);
                $cart->calculate();
                $cart->calculation = [
                    'total' => $cart->total->formatted(),
                    'subTotal' => $cart->subTotal->formatted(),
                    'subTotalDiscounted' => $cart->subTotalDiscounted->formatted(),
                    'taxTotal' => $cart->taxTotal->formatted(),
                    'discountTotal' => $cart->discountTotal->formatted(),
                ];

                foreach ($cart->lines as $cartLine) {
                    $cartLine->calculation = [
                        'total' => $cartLine->total->formatted(),
                        'subTotal' => $cartLine->subTotal->formatted(),
                        'subTotalDiscounted' => $cartLine->subTotalDiscounted->formatted(),
                        'taxTotal' => $cartLine->taxAmount->formatted(),
                        'discountTotal' => $cartLine->discountTotal->formatted(),
                        'unitPrice' => $cartLine->unitPrice->formatted(),
                        'unitPriceInclTax' => $cartLine->unitPriceInclTax->formatted(),
                    ];
                }
            }
        }
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $collectionGroups = CollectionGroup::with('collections.defaultUrl')->where('handle', '=', 'main')->first();

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'quote' => ['message' => trim($message), 'author' => trim($author)],
            'auth' => [
                'user' => $request->user(),
                'cart' => $cart ?? null,
            ],
            'ziggy' => fn(): array => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'collections' => $collectionGroups->collections,
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'false',
        ];
    }
}
