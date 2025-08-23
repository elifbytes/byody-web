<?php

namespace App\Http\Controllers\Api;

use App\Facades\Saitrans;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function getDistricts(Request $request){
        $search = $request->search;
        $page = $request->page ?? 1;
        $limit = $request->limit ?? 10;
        return Saitrans::getDistrict($search, $page, $limit);
    }
}
