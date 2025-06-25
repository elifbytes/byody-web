<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\WorkOS\Http\Requests\AuthKitAccountDeletionRequest;
use Lunar\Models\Country;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $customer = $user->customers()->latest()->first();
        return Inertia::render('settings/profile', [
            'customer' => $customer,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $request->user()->update(['name' => $request->name]);

        return to_route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(AuthKitAccountDeletionRequest $request): RedirectResponse
    {
        return $request->delete(
            using: fn(User $user) => $user->delete()
        );
    }

    /**
     * Show the customr's profile settings page.
     */
    public function customerEdit(Request $request): Response
    {
        $countries = Country::all();
        $customer = $request->user()->customers()->latest()->first();
        $customer->load('addresses');
        return Inertia::render('settings/customer-profile', [
            'countries' => $countries,
            'customer' => $customer,
        ]);
    }

    /**
     * Update the customer's profile settings.
     */
    public function updateCustomer(Request $request)
    {
        $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'company_name' => ['nullable', 'string', 'max:255'],
            'vat_no' => ['nullable', 'string', 'max:50'],
            'address.country_id' => ['required', 'exists:countries,id'],
            'address.line_one' => ['required', 'string', 'max:255'],
            'address.city' => ['required', 'string', 'max:100'],
            'address.state' => ['required', 'string', 'max:100'],
            'address.postcode' => ['nullable', 'string', 'max:20'],
            'address.delivery_instructions' => ['nullable', 'string', 'max:255'],
            'address.contact_email' => ['nullable', 'email', 'max:255'],
            'address.contact_phone' => ['nullable', 'string', 'max:20'],
        ]);

        $customer = $request->user()->customers()->latest()->first();
        if (!$customer) {
            $newCustomer = $request->user()->customers()->create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'company_name' => $request->company_name,
                'vat_no' => $request->vat_no,
            ]);
            $newCustomer->addresses()->create([
                'country_id' => $request->address['country_id'],
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'line_one' => $request->address['line_one'],
                'city' => $request->address['city'],
                'state' => $request->address['state'],
                'postcode' => $request->address['postcode'],
                'delivery_instructions' => $request->address['delivery_instructions'],
                'contact_email' => $request->address['contact_email'],
                'contact_phone' => $request->address['contact_phone'],
            ]);
        } else {
            $customer->update([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'company_name' => $request->company_name,
                'vat_no' => $request->vat_no,
            ]);
            $customer->addresses()->updateOrCreate(
                ['customer_id' => $customer->id],
                [
                    'country_id' => $request->address['country_id'],
                    'first_name' => $request->first_name,
                    'last_name' => $request->last_name,
                    'company_name' => $request->company_name,
                    'line_one' => $request->address['line_one'],
                    'city' => $request->address['city'],
                    'state' => $request->address['state'],
                    'postcode' => $request->address['postcode'],
                    'delivery_instructions' => $request->address['delivery_instructions'],
                    'contact_email' => $request->address['contact_email'],
                    'contact_phone' => $request->address['contact_phone'],
                ]
            );
        }

        return redirect()->back();
    }
}
