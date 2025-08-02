<?php

namespace App\Livewire\Widgets;

use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Lunar\Models\Order;
use Carbon\Carbon;

class OrdersPast30Days extends StatsOverviewWidget
{
    protected static ?string $pollingInterval = null;
    
    protected function getStats(): array
    {
        $current = Carbon::now()->subDays(30);
        $previous = Carbon::now()->subDays(60)->startOfDay();
        
        $ordersCurrent = Order::where('created_at', '>=', $current)->count();
        $ordersPrevious = Order::whereBetween('created_at', [$previous, $current])->count();
        
        $difference = $ordersCurrent - $ordersPrevious;
        $description = 'No change compared to last period';
        
        if ($difference > 0) {
            $description = "+{$difference} compared to last period";
        } elseif ($difference < 0) {
            $description = "{$difference} compared to last period";
        }
        
        return [
            Stat::make('Orders past 30 days', $ordersCurrent)
                ->description($description)
                ->descriptionIcon($difference > 0 ? 'heroicon-m-arrow-trending-up' : ($difference < 0 ? 'heroicon-m-arrow-trending-down' : null))
                ->color($difference > 0 ? 'success' : ($difference < 0 ? 'danger' : 'gray')),
        ];
    }
}