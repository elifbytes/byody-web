<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Lunar\Models\Country;
use Illuminate\Support\Facades\Http;
use Laravel\Prompts\Progress;
use function Laravel\Prompts\progress;

class AddressDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $existing = Country::pluck('iso3');

        /**
         * Here we are using Http over Https due to some environments not having
         * the latest CA Authorities installed, causing an SSL exception to be thrown.
         */
        $countries = Http::get('http://data.lunarphp.io/countries+states.json')
            ->object();

        $newCountries = collect($countries)->filter(function ($country) use ($existing) {
            return ! $existing->contains($country->iso3);
        });

        progress(
            'Importing Countries and States',
            $newCountries,
            function ($country, Progress $progress) {
                $model = Country::create([
                    'name' => $country->name,
                    'iso3' => $country->iso3,
                    'iso2' => $country->iso2,
                    'phonecode' => $country->phone_code,
                    'capital' => $country->capital,
                    'currency' => $country->currency,
                    'native' => $country->native,
                    'emoji' => $country->emoji,
                    'emoji_u' => $country->emojiU,
                ]);

                $states = collect($country->states)->map(function ($state) {
                    return [
                        'name' => $state->name,
                        'code' => $state->state_code,
                    ];
                });

                $model->states()->createMany($states->toArray());

                $progress->advance();
            }
        );
    }
}
