<?php

namespace App\Facades;

use App\Services\SaitransService;
use Illuminate\Support\Facades\Facade;

/**
 * @see SaitransService
 */
class Saitrans extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return SaitransService::class;
    }
}
