<?php

namespace App\Pipelines\Pricing;

use Closure;
use Lunar\Base\PricingManagerInterface;

class CustomPricingPipeline
{
    public function handle(PricingManagerInterface $pricingManager, Closure $next)
    {
        dd('CustomPricingPipeline executed');
        $matchedPrice = $pricingManager->pricing->matched;

        $matchedPrice->price->value = 200;

        $pricingManager->pricing->matched = $matchedPrice;

        return $next($pricingManager);
    }
}