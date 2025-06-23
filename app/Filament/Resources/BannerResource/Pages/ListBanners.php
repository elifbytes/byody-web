<?php

namespace App\Filament\Resources\BannerResource\Pages;

use App\Filament\Resources\BannerResource;
use App\Models\Banner;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use Illuminate\Database\Eloquent\Model;

class ListBanners extends ListRecords
{
    protected static string $resource = BannerResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make()->label('Create Banner')
                ->using(function (array $data, string $model): Model {
                    $banner = Banner::create([
                        'title' => $data['title'],
                    ]);

                    return $banner->addMediaFromString($data['media']->get())
                        ->usingFileName(
                            $data['media']->getClientOriginalName()
                        )
                        ->withCustomProperties([
                            'name' => $data['title'],
                            'primary' => false,
                        ])
                        ->preservingOriginal()
                        ->toMediaCollection(config('lunar.media.collection'));
                })->successRedirectUrl(route('filament.lunar.resources.banners.index'))
        ];
    }
}
