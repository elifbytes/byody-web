<?php

namespace App\Livewire\Widgets;

use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Lunar\Models\Order;
use Carbon\Carbon;

class SalesToday extends StatsOverviewWidget
{
    protected static ?string $pollingInterval = null;
    
    protected function getStats(): array
    {
        $yesterday = Carbon::yesterday()->startOfDay();
        $today = Carbon::today()->startOfDay();
        
        $salesToday = Order::whereBetween('created_at', [$today, Carbon::now()])
            ->sum('total');
        $salesYesterday = Order::whereBetween('created_at', [$yesterday, $today])
            ->sum('total');
        
        $difference = $salesToday - $salesYesterday;
        $description = 'No change compared to yesterday';
        
        if ($difference > 0) {
            $description = "+$" . number_format($difference, 2) . " compared to yesterday";
        } elseif ($difference < 0) {
            $description = "-$" . number_format(abs($difference), 2) . " compared to yesterday";
        }
        
        return [
            Stat::make('Sales today', '$' . number_format($salesToday, 2))
                ->description($description)
                ->descriptionIcon($difference > 0 ? 'heroicon-m-arrow-trending-up' : ($difference < 0 ? 'heroicon-m-arrow-trending-down' : null))
                ->color($difference > 0 ? 'success' : ($difference < 0 ? 'danger' : 'gray')),
        ];
    }
}