<?php

namespace App\Livewire\Widgets;

use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;
use Lunar\Models\Order;
use Carbon\Carbon;

class OrdersChart extends ChartWidget
{
    protected static ?string $heading = 'Order totals for the past year';
    
    protected int | string | array $columnSpan = 'full';
    
    protected function getData(): array
    {
        $data = $this->getOrdersData();
        
        return [
            'datasets' => [
                [
                    'label' => 'Orders',
                    'data' => $data['orders'],
                    'backgroundColor' => '#36A2EB',
                    'borderColor' => '#36A2EB',
                ],
            ],
            'labels' => $data['labels'],
        ];
    }
    
    protected function getType(): string
    {
        return 'line';
    }
    
    private function getOrdersData(): array
    {
        $now = Carbon::now();
        $startDate = $now->copy()->startOfYear();
        $endDate = $now->copy()->endOfYear();
        
        $orders = Order::select(
            DB::raw('MONTH(created_at) as month'),
            DB::raw('COUNT(*) as count')
        )
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->keyBy('month');
        
        $months = [
            1 => 'Jan', 2 => 'Feb', 3 => 'Mar', 4 => 'Apr', 5 => 'May', 6 => 'Jun',
            7 => 'Jul', 8 => 'Aug', 9 => 'Sep', 10 => 'Oct', 11 => 'Nov', 12 => 'Dec'
        ];
        
        $labels = [];
        $orderData = [];
        
        foreach ($months as $month => $name) {
            $labels[] = $name;
            $orderData[] = $orders[$month]->count ?? 0;
        }
        
        return [
            'labels' => $labels,
            'orders' => $orderData,
        ];
    }
}