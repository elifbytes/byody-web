<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Lunar\Models\Country;

class CountryController extends Controller
{
    public function index()
    {
        return Country::all();
    }

    public function states(string $countryId)
    {
        $country = Country::findOrFail($countryId);

        return $country->states;
    }
}
