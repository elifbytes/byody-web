<?php

namespace App\Livewire\Widgets;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;
use Lunar\Models\Order;
use Carbon\Carbon;

class OrdersSalesReport extends ChartWidget
{
    protected static ?string $heading = 'Orders / Sales Report';
    
    protected int | string | array $columnSpan = 'full';
    
    protected function getData(): array
    {
        $data = $this->getOrdersAndSalesData();
        
        return [
            'datasets' => [
                [
                    'label' => 'Orders',
                    'data' => $data['orders'],
                    'backgroundColor' => '#36A2EB',
                    'borderColor' => '#36A2EB',
                    'yAxisID' => 'y',
                ],
                [
                    'label' => 'Sales',
                    'data' => $data['sales'],
                    'backgroundColor' => '#FF6384',
                    'borderColor' => '#FF6384',
                    'yAxisID' => 'y1',
                ],
            ],
            'labels' => $data['labels'],
        ];
    }
    
    protected function getType(): string
    {
        return 'bar';
    }
    
    protected function getOptions(): array
    {
        return [
            'scales' => [
                'y' => [
                    'type' => 'linear',
                    'display' => true,
                    'position' => 'left',
                    'title' => [
                        'display' => true,
                        'text' => 'Orders',
                    ],
                ],
                'y1' => [
                    'type' => 'linear',
                    'display' => true,
                    'position' => 'right',
                    'title' => [
                        'display' => true,
                        'text' => 'Sales',
                    ],
                    'grid' => [
                        'drawOnChartArea' => false,
                    ],
                ],
            ],
        ];
    }
    
    private function getOrdersAndSalesData(): array
    {
        $now = Carbon::now();
        $startDate = $now->copy()->subMonths(5)->startOfMonth();
        $endDate = $now->copy()->endOfMonth();
        
        $data = Order::select(
            DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'),
            DB::raw('COUNT(*) as count'),
            DB::raw('SUM(total) as total')
        )
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('month')
            ->orderBy('month')
            ->get();
        
        $labels = [];
        $orders = [];
        $sales = [];
        
        foreach ($data as $item) {
            $date = Carbon::createFromFormat('Y-m', $item->month);
            $labels[] = $date->format('M');
            $orders[] = $item->count;
            $sales[] = $item->total;
        }
        
        return [
            'labels' => $labels,
            'orders' => $orders,
            'sales' => $sales,
        ];
    }
}