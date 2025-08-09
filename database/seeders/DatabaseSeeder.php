<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Lunar\Admin\Models\Staff;
use Lunar\Models\Currency;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     */
    public function run(): void
    {
        // $this->call(CurrencySeeder::class);
        // $this->call(CollectionSeeder::class);
        // $this->call(AttributeSeeder::class);
        // $this->call(TaxSeeder::class);
        // $this->call(ProductSeeder::class);
        // $this->call(ShippingSeeder::class);
        // $this->call(CustomerSeeder::class);
        // $this->call(OrderSeeder::class);

        DB::transaction(function () {
            Staff::firstOrCreate([
                'email' => 'admin@example.com',
                'first_name' => 'Admin',
                'last_name' => 'User',
                'password' => bcrypt('admin123'),
                'admin' => true,
            ]);

            if (! Currency::whereDefault(true)->exists()) {
                Currency::create([
                    'code' => 'IDR',
                    'name' => 'Indonesian Rupiah',
                    'exchange_rate' => 1,
                    'decimal_places' => 0,
                    'default' => true,
                    'enabled' => true,
                ]);
            }
        });
    }
}
