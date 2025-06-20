<?php

use Lunar\Base\StandardMediaDefinitions;

return [

    'definitions' => [
        'asset' => StandardMediaDefinitions::class,
        'brand' => StandardMediaDefinitions::class,
        'collection' => StandardMediaDefinitions::class,
        'product' => StandardMediaDefinitions::class,
        'product-option' => StandardMediaDefinitions::class,
        'product-option-value' => StandardMediaDefinitions::class,
    ],

    'collection' => 'images',

    'fallback' => [
        'url' => env('FALLBACK_IMAGE_URL', null),
        'path' => env('FALLBACK_IMAGE_PATH', null),
    ],

    'transformations' => [
        'zoom' => [
            'width' => 500,
            'height' => 500,
        ],
        'large' => [
            'width' => 800,
            'height' => 800,
        ],
        'medium' => [
            'width' => 400,
            'height' => 400,
        ],
        'small' => [
            'width' => 200,
            'height' => 200,
        ],
    ],
];
