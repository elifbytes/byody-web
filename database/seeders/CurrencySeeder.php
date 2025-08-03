<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Lunar\Models\Currency;

class CurrencySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Currency::create([
            'code' => 'IDR',
            'name' => 'Indonesian Rupiah',
            'exchange_rate' => 1,
            'decimal_places' => 0,
            'default' => true,
            'enabled' => true,
        ]);
    }
}
