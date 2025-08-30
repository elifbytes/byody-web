<?php

namespace App\Services;

use Exception;
use Http;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Lunar\Models\Cart;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Worksome\Exchange\Facades\Exchange;

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
        $goods = $this->getGoods($cart);
        try {
            $SaitransShippingOptions = $this->getTariff('ID', config('services.saitrans.origin_id'), $destinationId, $goods, !is_numeric($destinationId));
        } catch (ConnectionException|Exception) {
            return [];
        }
        return $SaitransShippingOptions['data'];
    }

    /**
     * @throws Exception
     */
    public function createOrder(Cart $cart): array
    {
        $shippingAddress = $cart->shippingAddress;
        if (!$shippingAddress) {
            if (!isset($shippingAddress->meta['destination_id']) || !isset($shippingAddress->meta['address_id'])) {
                throw new Exception('Missing shippingAddress meta');
            }
            throw new Exception('Missing shippingAddress');
        }
        $destinationId = $shippingAddress->meta['destination_id'];
        $destinationCountry = $shippingAddress->country;
        if (!$destinationCountry) {
            throw new Exception('Destination country not found');
        }
        $isExport = $destinationCountry->iso2 !== 'ID';
        $shippingOption = $cart->getShippingOption();
        if (!$shippingOption) {
            throw new Exception('Missing shipping option');
        }
        $goods = $this->getGoods($cart);
        $url = $this->base_url . '/api/v2/order/store';
        $data = [
            'sender_fullname' => config('services.saitrans.sender_fullname'),
            'sender_email' => config('services.saitrans.sender_email'),
            'sender_handphone' => config('services.saitrans.sender_handphone'),
            'sender_identity_number' => config('services.saitrans.sender_identity_number'),
            'sender_identity_type' => config('services.saitrans.sender_identity_type'),
            'sender_address' => config('services.saitrans.sender_address'),
            'sender_country_iso2' => config('services.saitrans.sender_country_iso2'),
            'sender_province' => config('services.saitrans.sender_province'),
            'sender_regency' => config('services.saitrans.sender_regency'),
            'sender_district' => config('services.saitrans.sender_district'),
            'sender_village' => config('services.saitrans.sender_village'),
            'sender_postalcode' => config('services.saitrans.sender_postal_code'),
            'recipient_fullname' => $shippingAddress->first_name . ' ' . $shippingAddress->last_name,
            'recipient_email' => $shippingAddress->contact_email,
            'recipient_handphone' => $shippingAddress->contact_phone,
            'recipient_identity_number' => '-',
            'recipient_identity_type' => '-',
            'recipient_address' => $shippingAddress->line_one,
            'recipient_country_iso2' => $destinationCountry->iso2,
            'recipient_regency' => $shippingAddress->city,
            'recipient_postalcode' => $shippingAddress->postcode,
            'price_of_goods' => $cart->subTotal->value,
            'vendor_service_id' => $shippingOption->identifier,
            'origin_id' => config('services.saitrans.origin_id'),
            'destination_id' => $destinationId,
            'order_type' => $isExport ? 'export' : 'domestic',
            'payment_method' => 'term_of_payment',
            'goods' => $goods,
        ];

        if ($isExport) {
            $exchangeRates = Exchange::rates($destinationCountry->currency, ['IDR']);
            $rates = $exchangeRates->getRates();
            $rate = $rates['IDR'];
            $data['price_of_goods_destination'] = round($cart->subTotal->value / $rate, 2);
            $data['currency_convert_to'] = $destinationCountry->currency;
        }

        $response = Http::withToken($this->access_token)->post($url, $data);
        if ($response->successful()) {
            return $response->json('data');
        } else {

            throw new Exception('Failed to create order: ' . $response->body());
        }
    }

    /**
     * @param Cart $cart
     * @return mixed
     */
    public function getGoods(Cart $cart): array
    {
        return $cart->lines->map(fn($line) => [
            'goods_name' => $line->purchasable->product->translateAttribute('name'),
            'goods_type' => 'package',
            'qty' => $line->quantity,
            'weight' => $line->purchasable->weight->getValue(),
            'vol_longth' => $line->purchasable->length->to('length.cm')->convert()->getValue(),
            'vol_width' => $line->purchasable->width->to('length.cm')->convert()->getValue(),
            'vol_height' => $line->purchasable->height->to('length.cm')->convert()->getValue(),
        ])->toArray();
    }

    /**
     * @throws Exception
     */
    public function confirmOrder(string $awbNumber): string
    {
        $url = $this->base_url . '/api/v2/order/confirmation_order';
        $data = [
            'awb_number' => $awbNumber,
        ];
        $response = Http::withToken($this->access_token)->post($url, $data);
        if ($response->successful()) {
            return $response->json('message');
        } else {
            throw new Exception('Failed to confirm order: ' . $response->body());
        }
    }

    /**
     * @throws Exception
     */
    public function getLabel(string $awbNumber): string
    {
        $url = $this->base_url . '/api/v2/order/label_goods';
        $data = [
            'awb_number' => $awbNumber,
        ];
        $response = Http::withToken($this->access_token)->post($url, $data);
        if ($response->successful()) {
            $filename = 'label_' . $awbNumber . '.pdf';
            // Get the PDF content
            $pdfContent = $response->body();

            Storage::put('labels/' . $filename, $pdfContent);
            return Storage::url('labels/' . $filename);
        } else {
            throw new Exception('Failed to get label: ' . $response->body());
        }
    }

    /**
     * @throws Exception
     */
    public function track(string $awbNumber): array
    {
        $url = $this->base_url . '/api/v2/order/track';
        $response = Http::withToken($this->access_token)->get($url . '/' . $awbNumber);
        if ($response->successful()) {
            return $response->json('data');
        } else {
            throw new Exception('Failed to track order: ' . $response->body());
        }
    }
}
