<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Lunar\Models\Address;
use Lunar\Models\Country;

class AddressController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $customer = $user->customers()->latest()->first();
        $addresses = $customer->addresses()->with('country')->orderBy('id')->get();

        $countries = Country::all();

        return inertia('settings/address', [
            'addresses' => $addresses,
            'countries' => $countries,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'contact_email' => ['nullable', 'email', 'max:255'],
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'contact_phone' => ['required', 'string', 'max:20', 'regex:/^\+?[0-9\s\-()]+$/'],
            'country_id' => ['required', 'exists:countries,id'],
            'city' => ['required', 'string', 'max:100'],
            'line_one' => ['required', 'string', 'max:255'],
            'postcode' => ['required', 'string', 'max:20'],
            'delivery_instructions' => ['nullable', 'string', 'max:255'],
            'meta' => ['nullable', 'array'],
            'meta.id' => ['required_with:meta', 'string', 'max:10'],
            'meta.regency_id' => ['required_with:meta', 'string', 'max:10'],
            'meta.name' => ['required_with:meta', 'string', 'max:255'],
        ]);

        $customer = $request->user()->customers()->latest()->first();
        if (!$customer) {
            return redirect()->back()->withErrors(['customer' => 'Customer profile not found.']);
        }
        // Check if the customer already has a default shipping address
        $existingShippingDefault = $customer->addresses()->where('shipping_default', true)->exists();

        // If no default shipping address exists, set the new address as the default
        if (!$existingShippingDefault) {
            $data['shipping_default'] = true;
            $data['billing_default'] = true;
        } else {
            $data['shipping_default'] = false;
            $data['billing_default'] = false;
        }

        $country = Country::find($data['country_id']);
        if (!$country) {
            return redirect()->back()->withErrors(['country_id' => 'Selected country does not exist.']);
        }
        $customer->addresses()->create([
            'country_id' => $data['country_id'],
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'line_one' => $data['line_one'],
            'city' => $data['city'],
            'postcode' => $data['postcode'],
            'delivery_instructions' => $data['delivery_instructions'] ?? null,
            'contact_email' => $data['contact_email'] ?? null,
            'contact_phone' => $data['contact_phone'],
            'shipping_default' => $data['shipping_default'],
            'billing_default' => $data['billing_default'],
            'meta' => $data['meta'] ?? [
                'id' => $country->iso2,
                'name' => $country->name,
            ],
        ]);

        return redirect()->back();
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Address $address)
    {
        $data = $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'country_id' => ['required', 'exists:countries,id'],
            'line_one' => ['required', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'postcode' => ['required', 'string', 'max:20'],
            'delivery_instructions' => ['nullable', 'string', 'max:255'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'contact_phone' => ['required', 'string', 'max:20', 'regex:/^\+?[0-9\s\-()]+$/'],
            'shipping_default' => ['nullable', 'boolean'],
            'billing_default' => ['nullable', 'boolean'],
        ]);

        if ($data['shipping_default'] && $data['billing_default']) {
            // Ensure only one address can be set as both shipping and billing default
            Address::where('customer_id', $address->customer_id)
                ->where('id', '!=', $address->id)
                ->update(['shipping_default' => false, 'billing_default' => false]);
        }

        $address->update([
            'country_id' => $data['country_id'],
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
            'line_one' => $data['line_one'],
            'city' => $data['city'],
            'postcode' => $data['postcode'],
            'delivery_instructions' => $data['delivery_instructions'] ?? null,
            'contact_email' => $data['contact_email'] ?? null,
            'contact_phone' => $data['contact_phone'],
            'shipping_default' => $data['shipping_default'] ?? false,
            'billing_default' => $data['billing_default'] ?? false,
        ]);

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Address $address)
    {
        $address->delete();
        return redirect()->back();
    }
}
