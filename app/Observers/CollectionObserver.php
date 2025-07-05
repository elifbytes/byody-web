<?php

namespace App\Observers;

use Illuminate\Support\Facades\Cache;
use Lunar\Models\Collection;

class CollectionObserver
{
    /**
     * Handle the Collection "created" event.
     */
    public function created(Collection $collection): void
    {
        Cache::forget('main_collections');
    }

    /**
     * Handle the Collection "updated" event.
     */
    public function updated(Collection $collection): void
    {
        Cache::forget('main_collections');
    }

    /**
     * Handle the Collection "deleted" event.
     */
    public function deleted(Collection $collection): void
    {
        Cache::forget('main_collections');
    }

    /**
     * Handle the Collection "restored" event.
     */
    public function restored(Collection $collection): void
    {
        Cache::forget('main_collections');
    }

    /**
     * Handle the Collection "force deleted" event.
     */
    public function forceDeleted(Collection $collection): void
    {
        Cache::forget('main_collections');
    }
}
