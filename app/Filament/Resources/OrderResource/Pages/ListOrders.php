<?php

namespace App\Filament\Resources\OrderResource\Pages;

use App\Filament\Resources\OrderResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListOrders extends ListRecords
{
    protected static string $resource = OrderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            // Remove create action since orders are created from the frontend
        ];
    }

    public function getTitle(): string
    {
        return 'Orders Management';
    }

    public function getHeading(): string
    {
        return 'Orders';
    }

    public function getSubheading(): ?string
    {
        return 'Manage customer orders and track their status';
    }
}
