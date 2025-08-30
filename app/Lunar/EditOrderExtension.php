<?php

namespace App\Lunar;

use App\Facades\Saitrans;
use App\Filament\Lunar\Widgets\TrackShipping;
use Exception;
use Filament\Actions;
use Filament\Notifications\Notification;
use Lunar\Admin\Support\Extending\EditPageExtension;
use Lunar\Admin\Filament\Widgets;
use Lunar\Models\Order;

class EditOrderExtension extends EditPageExtension
{
    private Order $order;

    public function setCaller(?object $caller): void
    {
        $this->order = $caller->record;
        $this->caller = $caller;
    }

    public function headerActions(array $actions): array
    {
        return [
            Actions\Action::make('print_label')
                ->label('Download Label')
                ->color('primary')
                ->visible(fn() => in_array($this->order->status, ['dispatched', 'payment-received']))
                ->url(function () {
                    $awbNumber = $this->order->meta->shipping_awb_number;
                    if (empty($awbNumber)) {
                        Notification::make()->title('AWB Number is not available for this order.')->danger()->send();
                        return '#';
                    }
                    try {
                        $labelUrl = Saitrans::getLabel($awbNumber);
                        if ($labelUrl) {
                            return $labelUrl;
                        } else {
                            Notification::make()->title('Failed to retrieve shipping label.')->danger()->send();
                            return '#';
                        }
                    } catch (Exception $e) {
                        Notification::make()->title('Error: ' . $e->getMessage())->danger()->send();
                        return '#';
                    }
                })
                ->openUrlInNewTab(),
            Actions\Action::make('confirm_order')
                ->label('Confirm Order & Request Pickup')
                ->color('success')
                ->visible(fn() => $this->order->status === 'payment-received')
                ->requiresConfirmation()
                ->action(function (Order $record) {
                    $awbNumber = $record->meta->shipping_awb_number;
                    if (empty($awbNumber)) {
                        Notification::make()->title('AWB Number is required to confirm the order.')->danger()->send();
                        return;
                    }
                    try {
                        $shippingStatus = Saitrans::confirmOrder($awbNumber);
                        $record->update([
                            'status' => 'dispatched',
                        ]);
                        Notification::make()->title($shippingStatus)->success()->send();
                    } catch (Exception $e) {
                        Notification::make()->title('Failed to confirm order: ' . $e->getMessage())->danger()->send();
                        return;
                    }
                }),
        ];
    }
}
