<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Actions\Action;
use Illuminate\Database\Eloquent\Builder;
use Lunar\Models\Order;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-bag';

    protected static ?string $navigationGroup = 'Sales';

    protected static ?string $navigationLabel = 'Orders';

    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Order Information')
                    ->schema([
                        Forms\Components\TextInput::make('reference')
                            ->label('Order Reference')
                            ->disabled()
                            ->dehydrated(false),
                        Forms\Components\Select::make('status')
                            ->label('Status')
                            ->options([
                                'awaiting-payment' => 'Awaiting Payment',
                                'payment-received' => 'Payment Received',
                                'payment-offline' => 'Payment Offline',
                                'dispatched' => 'Dispatched',
                            ])
                            ->required(),
                        Forms\Components\DateTimePicker::make('placed_at')
                            ->label('Placed At')
                            ->disabled()
                            ->dehydrated(false),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Customer Information')
                    ->schema([
                        Forms\Components\TextInput::make('user.name')
                            ->label('Customer Name')
                            ->disabled()
                            ->dehydrated(false),
                        Forms\Components\TextInput::make('user.email')
                            ->label('Customer Email')
                            ->disabled()
                            ->dehydrated(false),
                    ])
                    ->columns(2)
                    ->visible(fn($record) => $record && $record->user),

                Forms\Components\Section::make('Order Totals')
                    ->schema([
                        Forms\Components\TextInput::make('sub_total_formatted')
                            ->label('Subtotal')
                            ->disabled()
                            ->dehydrated(false)
                            ->formatStateUsing(function($record) {
                                if (!$record) return '';
                                $amount = is_object($record->sub_total) ? $record->sub_total->value : $record->sub_total;
                                return 'IDR ' . number_format($amount, 0, ',', '.');
                            }),
                        Forms\Components\TextInput::make('tax_total_formatted')
                            ->label('Tax Total')
                            ->disabled()
                            ->dehydrated(false)
                            ->formatStateUsing(function($record) {
                                if (!$record) return '';
                                $amount = is_object($record->tax_total) ? $record->tax_total->value : $record->tax_total;
                                return 'IDR ' . number_format($amount, 0, ',', '.');
                            }),
                        Forms\Components\TextInput::make('shipping_total_formatted')
                            ->label('Shipping Total')
                            ->disabled()
                            ->dehydrated(false)
                            ->formatStateUsing(function($record) {
                                if (!$record) return '';
                                $amount = is_object($record->shipping_total) ? $record->shipping_total->value : $record->shipping_total;
                                return 'IDR ' . number_format($amount, 0, ',', '.');
                            }),
                        Forms\Components\TextInput::make('total_formatted')
                            ->label('Total')
                            ->disabled()
                            ->dehydrated(false)
                            ->formatStateUsing(function($record) {
                                if (!$record) return '';
                                $amount = is_object($record->total) ? $record->total->value : $record->total;
                                return 'IDR ' . number_format($amount, 0, ',', '.');
                            }),
                    ])
                    ->columns(2),

                Forms\Components\Section::make('Notes')
                    ->schema([
                        Forms\Components\Textarea::make('notes')
                            ->label('Order Notes')
                            ->rows(3),
                    ])
                    ->collapsible(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('reference')
                    ->label('Order #')
                    ->searchable()
                    ->sortable()
                    ->copyable(),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Customer')
                    ->searchable()
                    ->sortable()
                    ->default('Guest'),
                Tables\Columns\TextColumn::make('status')
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
                Tables\Columns\TextColumn::make('total')
                    ->label('Total')
                    ->formatStateUsing(function($state) {
                        if (!$state) return '';
                        $amount = is_object($state) ? $state->value : $state;
                        return 'IDR ' . number_format($amount, 0, ',', '.');
                    })
                    ->sortable(),
                Tables\Columns\TextColumn::make('placed_at')
                    ->label('Placed At')
                    ->dateTime('d M Y, H:i')
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime('d M Y, H:i')
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'awaiting-payment' => 'Awaiting Payment',
                        'payment-received' => 'Payment Received',
                        'payment-offline' => 'Payment Offline',
                        'dispatched' => 'Dispatched',
                    ]),
                Tables\Filters\Filter::make('placed_at')
                    ->form([
                        Forms\Components\DatePicker::make('placed_from')
                            ->label('Placed From'),
                        Forms\Components\DatePicker::make('placed_until')
                            ->label('Placed Until'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['placed_from'],
                                fn (Builder $query, $date): Builder => $query->whereDate('placed_at', '>=', $date),
                            )
                            ->when(
                                $data['placed_until'],
                                fn (Builder $query, $date): Builder => $query->whereDate('placed_at', '<=', $date),
                            );
                    }),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
                Action::make('download_pdf')
                    ->label('Download PDF')
                    ->icon('heroicon-o-document-arrow-down')
                    ->url(fn (Order $record): string => route('orders.pdf', $record))
                    ->openUrlInNewTab()
                    ->visible(fn (Order $record): bool => $record->status !== 'awaiting-payment'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrders::route('/'),
            'view' => Pages\ViewOrder::route('/{record}'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }

    public static function getNavigationBadge(): ?string
    {
        return static::getModel()::where('status', 'payment-received')->count();
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'success';
    }
}
