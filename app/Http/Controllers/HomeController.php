<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Lunar\Models\Collection;

class HomeController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        return inertia('home');
    }
}
