<?php

namespace App\Livewire\Widgets;

use Filament\Widgets\StatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Lunar\Models\Order;
use Carbon\Carbon;

class SalesPast7Days extends StatsOverviewWidget
{
    protected static ?string $pollingInterval = null;
    
    protected function getStats(): array
    {
        $current = Carbon::now()->subDays(7);
        $previous = Carbon::now()->subDays(14)->startOfDay();
        
        $salesCurrent = Order::where('created_at', '>=', $current)->sum('total');
        $salesPrevious = Order::whereBetween('created_at', [$previous, $current])->sum('total');
        
        $difference = $salesCurrent - $salesPrevious;
        $description = 'No change compared to last period';
        
        if ($difference > 0) {
            $description = "+$" . number_format($difference, 2) . " compared to last period";
        } elseif ($difference < 0) {
            $description = "-$" . number_format(abs($difference), 2) . " compared to last period";
        }
        
        return [
            Stat::make('Sales past 7 days', '$' . number_format($salesCurrent, 2))
                ->description($description)
                ->descriptionIcon($difference > 0 ? 'heroicon-m-arrow-trending-up' : ($difference < 0 ? 'heroicon-m-arrow-trending-down' : null))
                ->color($difference > 0 ? 'success' : ($difference < 0 ? 'danger' : 'gray')),
        ];
    }
}