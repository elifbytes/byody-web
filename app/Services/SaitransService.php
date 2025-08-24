<?php

namespace App\Services;

use Exception;
use Http;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Cache;
use Lunar\Models\Cart;

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

    /**
     * @throws ConnectionException
     * @throws Exception
     */
    public function getDistrict(string $search, int $page = 1, int $limit = 10): array
    {
        $url = $this->base_url . '/api/v2/location/district';
        $query = [
            'search' => $search,
            'page' => $page,
            'limit' => $limit,
        ];
        $response = Http::withHeader('Accept', 'application/json')->withToken($this->access_token)->get($url, $query);
        if ($response->successful()) {
            return $response->json('data');
        } else {
            throw new Exception('Failed to fetch districts');
        }
    }

    /**
     * @throws ConnectionException
     * @throws Exception
     */
    public function getTariff(string $country_iso, string $origin_id, string $destination_id, array $goods, bool $is_export = false): array
    {
        $url = $this->base_url . '/api/v2/tariff/' . ($is_export ? 'export' : 'domestic');
        $data = [
            'country_iso' => $country_iso,
            'origin_id' => $origin_id,
            'destination_id' => $destination_id,
            'goods' => $goods,
        ];
        $response = Http::withToken($this->access_token)->post($url, $data);

        if ($response->successful()) {
            return $response->json('data');
        } else {
            throw new Exception('Failed to fetch tariff');
        }
    }

    public function getShippingOptions(Cart $cart): array
    {
        $shippingAddress = $cart->shippingAddress;
        if (!$shippingAddress) {
            return [];
        }
        $destinationId = $shippingAddress->meta['destination_id'];
        $goods = $cart->lines->map(fn($line) => [
            'goods_name' => $line->purchasable->product->translateAttribute('name'),
            'goods_type' => 'package',
            'qty' => $line->quantity,
            'weight' => $line->purchasable->weight->getValue(),
            'vol_longth' => $line->purchasable->length->to('length.cm')->convert()->getValue(),
            'vol_width' => $line->purchasable->width->to('length.cm')->convert()->getValue(),
            'vol_height' => $line->purchasable->height->to('length.cm')->convert()->getValue(),
        ])->toArray();
        try {
            $SaitransShippingOptions = $this->getTariff('ID', config('services.saitrans.origin_id'), $destinationId, $goods, !is_numeric($destinationId));
        } catch (ConnectionException|Exception $e) {
            return [];
        }
        return $SaitransShippingOptions['data'];
    }
}
