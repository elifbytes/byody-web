<?php

namespace App\Http\Controllers\Api;

use App\Facades\Saitrans;
use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function getDistricts(Request $request){
        $search = $request->search;
        $page = $request->page ?? 1;
        $limit = $request->limit ?? 10;
        try {
            $districts = Saitrans::getDistrict($search, $page, $limit);
            return response()->json($districts);
        } catch (ConnectionException|Exception $e) {
            return response()->json(["message" => $e->getMessage()], $e->getCode());
        }
    }
}
