<?php

namespace App\Services;

use Exception;
use Http;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class SaitransService
{
    private string $base_url;
    private string $email;
    private string $password;
    private string $access_token;
    public function __construct()
    {
        $this->base_url = config('services.saitrans.base_url');
        $this->email = config('services.saitrans.email');
        $this->password = config('services.saitrans.password');
        $this->access_token = Cache::get('saitrans_access_token', '');
        if (empty($this->access_token)) {
            $this->getAccessToken();
        }
    }

    public function getAccessToken(): string
    {
        if (empty($this->access_token)) {
            $url = $this->base_url . '/api/v2/auth/login';
            $data = [
                'email' => $this->email,
                'password' => $this->password,
            ];
            try {
                $response = Http::withHeader('Accept', 'application/json')->post($url, $data);
            } catch (ConnectionException|Exception) {
                return '';
            }
            if ($response->successful()) {
                $this->access_token = $response->json('data.access_token');
                $expires_in = $response->json('data.expires_in', 3600); // Default to 1 hour if not provided
                if (!empty($this->access_token)) {
                    Cache::put('saitrans_access_token', $this->access_token, now()->addSeconds($expires_in));
                }
            }
        }
        return $this->access_token;
    }

    public function getDistrict(string $search, int $page=1, int $limit=10): JsonResponse
    {
        $url = $this->base_url . '/api/v2/location/district';
        $query = [
            'search' => $search,
            'page' => $page,
            'limit' => $limit,
        ];
        try {
            $response = Http::withHeader('Accept', 'application/json')->withToken($this->access_token)->get($url, $query);
        } catch (ConnectionException|Exception $e) {
            return response()->json(['message' => $e->getMessage()], $e->getCode());
        }
        if ($response->successful()) {
            return response()->json($response->json('data'));
        } else {
            return response()->json(['message' => 'Failed to fetch districts'], $response->status());
        }
    }
}
