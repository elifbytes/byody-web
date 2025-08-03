<?php

namespace App\Filament\Pages;

use App\Livewire\Widgets\OrdersPast7Days;
use Filament\Pages\Dashboard as FilamentDashboard;

class Dashboard extends FilamentDashboard
{
    protected static ?string $navigationIcon = 'heroicon-o-home';
    
    protected static ?int $navigationSort = -1;
    protected static ?string $slug = 'dashboard';
    protected static string $routePath = '';
    
    // Override ini untuk mengganti widget default Lunar
    // public function getWidgets(): array
    // {
    //     return []; // Kosongkan array ini untuk menghilangkan widget bawaan Lunar
    // }
    
    protected function getHeaderWidgets(): array
    {
        return [
            OrdersPast7Days::class,
        ];
    }
    
    protected function getFooterWidgets(): array
    {
        return [];
    }
}