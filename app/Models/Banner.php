<?php

namespace App\Models;

use Lunar\Base\Traits\HasMedia;
use Spatie\MediaLibrary\HasMedia as SpatieHasMedia;

use Illuminate\Database\Eloquent\Model;

class Banner extends Model implements SpatieHasMedia
{
    use HasMedia;

    protected $fillable = [
        'title',
        'order_column',
    ];
}
