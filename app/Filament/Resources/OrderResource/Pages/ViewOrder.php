<?php

namespace App\Filament\Resources\OrderResource\Pages;

use App\Filament\Resources\OrderResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;
use Filament\Infolists;
use Filament\Infolists\Infolist;

class ViewOrder extends ViewRecord
{
    protected static string $resource = OrderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
            Actions\Action::make('download_pdf')
                ->label('Download PDF')
                ->icon('heroicon-o-document-arrow-down')
                ->url(fn (): string => route('orders.pdf', $this->record))
                ->openUrlInNewTab()
                ->visible(fn (): bool => $this->record->status !== 'awaiting-payment'),
        ];
    }

    public function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                Infolists\Components\Section::make('Order Details')
                    ->schema([
                        Infolists\Components\Grid::make(2)
                            ->schema([
                                Infolists\Components\TextEntry::make('reference')
                                    ->label('Order Reference')
                                    ->badge()
                                    ->color('primary'),
                                Infolists\Components\TextEntry::make('status')
                                    ->label('Status')
                                    ->badge()
                                    ->color(fn (string $state): string => match ($state) {
                                        'awaiting-payment' => 'gray',
                                        'payment-received' => 'success',
                                        'payment-offline' => 'warning',
                                        'dispatched' => 'primary',
                                        default => 'gray',
                                    })
                                    ->formatStateUsing(fn (string $state): string => match ($state) {
                                        'awaiting-payment' => 'Awaiting Payment',
                                        'payment-received' => 'Payment Received',
                                        'payment-offline' => 'Payment Offline',
                                        'dispatched' => 'Dispatched',
                                        default => $state,
                                    }),
                                Infolists\Components\TextEntry::make('placed_at')
                                    ->label('Placed At')
                                    ->dateTime('d M Y, H:i'),
                                Infolists\Components\TextEntry::make('created_at')
                                    ->label('Created At')
                                    ->dateTime('d M Y, H:i'),
                            ]),
                    ]),

                Infolists\Components\Section::make('Customer Information')
                    ->schema([
                        Infolists\Components\Grid::make(2)
                            ->schema([
                                Infolists\Components\TextEntry::make('user.name')
                                    ->label('Customer Name')
                                    ->default('Guest Customer'),
                                Infolists\Components\TextEntry::make('user.email')
                                    ->label('Customer Email')
                                    ->default('No email provided'),
                            ]),
                    ])
                    ->visible(fn (): bool => $this->record->user !== null),

                Infolists\Components\Section::make('Order Items')
                    ->schema([
                        Infolists\Components\RepeatableEntry::make('lines')
                            ->label('')
                            ->schema([
                                Infolists\Components\Grid::make(4)
                                    ->schema([
                                        Infolists\Components\TextEntry::make('description')
                                            ->label('Product')
                                            ->weight('bold'),
                                        Infolists\Components\TextEntry::make('quantity')
                                            ->label('Quantity'),
                                        Infolists\Components\TextEntry::make('unit_price')
                                            ->label('Unit Price')
                                            ->formatStateUsing(function($state) {
                                                if (!$state) return 'IDR 0';
                                                $amount = is_object($state) ? $state->value : $state;
                                                return 'IDR ' . number_format($amount, 0, ',', '.');
                                            }),
                                        Infolists\Components\TextEntry::make('total')
                                            ->label('Total')
                                            ->formatStateUsing(function($state) {
                                                if (!$state) return 'IDR 0';
                                                $amount = is_object($state) ? $state->value : $state;
                                                return 'IDR ' . number_format($amount, 0, ',', '.');
                                            })
                                            ->weight('bold'),
                                    ]),
                            ]),
                    ]),

                Infolists\Components\Section::make('Shipping Address')
                    ->schema([
                        Infolists\Components\TextEntry::make('shipping_address.first_name')
                            ->label('Name')
                            ->formatStateUsing(function ($record) {
                                $address = $record->shipping_address;
                                if (!$address) return 'No shipping address';
                                return trim($address->first_name . ' ' . $address->last_name);
                            }),
                        Infolists\Components\TextEntry::make('shipping_address.line_one')
                            ->label('Address')
                            ->formatStateUsing(function ($record) {
                                $address = $record->shipping_address;
                                if (!$address) return 'No shipping address';
                                $parts = array_filter([
                                    $address->line_one,
                                    $address->line_two,
                                    $address->city,
                                    $address->state,
                                    $address->postcode,
                                ]);
                                return implode(', ', $parts);
                            }),
                        Infolists\Components\TextEntry::make('shipping_address.contact_phone')
                            ->label('Phone'),
                        Infolists\Components\TextEntry::make('shipping_address.contact_email')
                            ->label('Email'),
                    ])
                    ->columns(2)
                    ->visible(fn (): bool => $this->record->shipping_address !== null),

                Infolists\Components\Section::make('Order Summary')
                    ->schema([
                        Infolists\Components\Grid::make(2)
                            ->schema([
                                Infolists\Components\TextEntry::make('sub_total')
                                    ->label('Subtotal')
                                    ->formatStateUsing(function($state) {
                                        if (!$state) return 'IDR 0';
                                        $amount = is_object($state) ? $state->value : $state;
                                        return 'IDR ' . number_format($amount, 0, ',', '.');
                                    }),
                                Infolists\Components\TextEntry::make('discount_total')
                                    ->label('Discount')
                                    ->formatStateUsing(function($state) {
                                        if (!$state) return 'IDR 0';
                                        $amount = is_object($state) ? $state->value : $state;
                                        return 'IDR ' . number_format($amount, 0, ',', '.');
                                    }),
                                Infolists\Components\TextEntry::make('shipping_total')
                                    ->label('Shipping')
                                    ->formatStateUsing(function($state) {
                                        if (!$state) return 'IDR 0';
                                        $amount = is_object($state) ? $state->value : $state;
                                        return 'IDR ' . number_format($amount, 0, ',', '.');
                                    }),
                                Infolists\Components\TextEntry::make('tax_total')
                                    ->label('Tax')
                                    ->formatStateUsing(function($state) {
                                        if (!$state) return 'IDR 0';
                                        $amount = is_object($state) ? $state->value : $state;
                                        return 'IDR ' . number_format($amount, 0, ',', '.');
                                    }),
                            ]),
                        Infolists\Components\Fieldset::make('')
                            ->schema([
                                Infolists\Components\TextEntry::make('total')
                                    ->label('Total Amount')
                                    ->formatStateUsing(function($state) {
                                        if (!$state) return 'IDR 0';
                                        $amount = is_object($state) ? $state->value : $state;
                                        return 'IDR ' . number_format($amount, 0, ',', '.');
                                    })
                                    ->size('lg')
                                    ->weight('bold')
                                    ->color('primary'),
                            ]),
                    ]),

                Infolists\Components\Section::make('Additional Information')
                    ->schema([
                        Infolists\Components\TextEntry::make('notes')
                            ->label('Order Notes')
                            ->default('No notes provided'),
                        Infolists\Components\TextEntry::make('meta')
                            ->label('Payment Information')
                            ->formatStateUsing(function ($state) {
                                if (!$state || !is_array($state)) return 'No payment information';
                                $info = [];
                                if (isset($state['invoice_id'])) {
                                    $info[] = 'Invoice ID: ' . $state['invoice_id'];
                                }
                                if (isset($state['amount'])) {
                                    $info[] = 'Amount: IDR ' . number_format($state['amount'], 0, ',', '.');
                                }
                                return implode(' | ', $info) ?: 'No payment information';
                            }),
                    ])
                    ->collapsible(),
            ]);
    }

    public function getTitle(): string
    {
        return 'Order #' . $this->record->reference;
    }
}
