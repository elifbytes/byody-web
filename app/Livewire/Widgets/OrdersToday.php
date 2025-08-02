<?php

namespace App\Livewire\Widgets;

use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Lunar\Models\Order;
use Carbon\Carbon;

class OrdersToday extends StatsOverviewWidget
{
    protected static ?string $pollingInterval = null;
    
    protected function getStats(): array
    {
        $yesterday = Carbon::yesterday()->startOfDay();
        $today = Carbon::today()->startOfDay();
        
        $ordersToday = Order::whereBetween('created_at', [$today, Carbon::now()])->count();
        $ordersYesterday = Order::whereBetween('created_at', [$yesterday, $today])->count();
        
        $difference = $ordersToday - $ordersYesterday;
        $description = 'No change compared to yesterday';
        
        if ($difference > 0) {
            $description = "+{$difference} compared to yesterday";
        } elseif ($difference < 0) {
            $description = "{$difference} compared to yesterday";
        }
        
        return [
            Stat::make('Orders today', $ordersToday)
                ->description($description)
                ->descriptionIcon($difference > 0 ? 'heroicon-m-arrow-trending-up' : ($difference < 0 ? 'heroicon-m-arrow-trending-down' : null))
                ->color($difference > 0 ? 'success' : ($difference < 0 ? 'danger' : 'gray')),
        ];
    }
}