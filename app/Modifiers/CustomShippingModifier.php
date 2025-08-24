<?php

namespace App\Modifiers;

use App\Facades\Saitrans;
use Closure;
use Lunar\Base\ShippingModifier;
use Lunar\DataTypes\Price;
use Lunar\DataTypes\ShippingOption;
use Lunar\Exceptions\InvalidDataTypeValueException;
use Lunar\Facades\ShippingManifest;
use Lunar\Models\TaxClass;
use Lunar\Models\Cart;

class CustomShippingModifier extends ShippingModifier
{
    /**
     * @throws InvalidDataTypeValueException
     */
    public function handle(Cart|\Lunar\Models\Contracts\Cart $cart, Closure $next)
    {
        // Get the tax class
        $taxClass = TaxClass::getDefault();
        $shippingOptions = Saitrans::getShippingOptions($cart);
        foreach ($shippingOptions as $shippingOption) {
            $price = new Price(
                value: $shippingOption['price'],
                currency: $cart->currency,
            );
            ShippingManifest::addOption(new ShippingOption(
                name: $shippingOption['service']['name'],
                description: $shippingOption['service']['description'] ?? null,
                identifier: $shippingOption['service']['id'],
                price: $price,
                taxClass: $taxClass,
                collect: false,
                meta: $shippingOption,
            ));
        }

        return $next($cart);
    }
}
