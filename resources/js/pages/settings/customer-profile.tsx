import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combo-box';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import countryService from '@/services/country-service';
import { Country, State } from '@/types/country';
import { Customer } from '@/types/customer';
import { Head, useForm } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';

interface CustomerProfilePageProps {
    countries: Country[];
    customer?: Customer;
}

const defaultAddress = {
    line_one: '',
    city: '',
    state: '',
    postcode: '',
    delivery_instructions: '',
    contact_email: '',
    contact_phone: '',
};

type CustomerForm = Omit<Customer, 'id' | 'created_at' | 'updated_at'> & {
    address: {
        country_id?: number;
        line_one: string;
        city: string;
        state?: string;
        postcode: string;
        delivery_instructions?: string;
        contact_email?: string;
        contact_phone?: string;
    };
};

function CustomerProfilePage({ customer, countries }: CustomerProfilePageProps) {
    const { data, setData, post, processing, errors } = useForm<CustomerForm>({
        first_name: customer?.first_name || '',
        last_name: customer?.last_name || '',
        company_name: customer?.company_name || '',
        vat_no: customer?.vat_no || '',
        address: customer?.addresses?.[0] || defaultAddress,
    });
    const [states, setStates] = useState<State[]>([]);

    const handleCountryChange = useCallback(async () => {
        if (data.address.country_id) {
            const states = await countryService.getStates(data.address.country_id);
            setStates(states);
        }
    }, [data.address.country_id]);

    const handleSubmit = () => {
        post(route('customer.profile.update'), {
            onSuccess: () => {
                // Handle success, e.g., show a success message
            },
            onError: (errors) => {
                // Handle errors, e.g., show error messages
                console.error(errors);
            },
        });
    };

    useEffect(() => {
        handleCountryChange();
    }, [handleCountryChange]);

    return (
        <AppLayout>
            <Head title="Profile settings" />

            <SettingsLayout>
                <h1 className="mb-4 text-2xl font-bold">Customer Profile</h1>
                <div className="mb-4">
                    <Label htmlFor="first_name">
                        First Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="first_name"
                        type="text"
                        value={data.first_name}
                        onChange={(e) => setData('first_name', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <InputError>{errors.first_name}</InputError>
                </div>
                <div className="mb-4">
                    <Label htmlFor="last_name">
                        Last Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="last_name"
                        type="text"
                        value={data.last_name}
                        onChange={(e) => setData('last_name', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <InputError>{errors.last_name}</InputError>
                </div>
                <div className="mb-4">
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                        id="company_name"
                        type="text"
                        value={data.company_name}
                        onChange={(e) => setData('company_name', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <InputError>{errors.company_name}</InputError>
                </div>
                <div className="mb-4">
                    <Label htmlFor="vat_no">VAT Number</Label>
                    <Input
                        id="vat_no"
                        type="text"
                        value={data.vat_no}
                        onChange={(e) => setData('vat_no', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                    <InputError>{errors.vat_no}</InputError>
                </div>
                <div className="mb-4">
                    <Label>
                        Country <span className="text-destructive">*</span>
                    </Label>
                    <Combobox
                        placeholder="Country"
                        items={countries.map((country) => {
                            return {
                                value: country.id.toString(),
                                label: country.name,
                            };
                        })}
                        value={data.address.country_id?.toString() || null}
                        onChange={(value) => {
                            if (!value) {
                                setData('address.country_id', undefined);
                                setStates([]);
                                return;
                            }
                            const countryId = parseInt(value, 10);
                            setData('address.country_id', countryId);
                        }}
                    />
                    <InputError>{errors['address.country_id']}</InputError>
                </div>
                <div className="mb-4">
                    <Label>
                        State <span className="text-destructive">*</span>
                    </Label>
                    <Combobox
                        placeholder="State"
                        items={states.map((state) => {
                            return {
                                value: state.name,
                                label: state.name,
                            };
                        })}
                        value={data.address.state || null}
                        onChange={(value) => {
                            setData('address.state', value || undefined);
                        }}
                    />
                    <InputError>{errors['address.state']}</InputError>
                </div>
                <div className="mb-4">
                    <Label>
                        City <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        type="text"
                        value={data.address.city}
                        onChange={(e) => {
                            setData('address.city', e.target.value);
                        }}
                    />
                    <InputError>{errors['address.city']}</InputError>
                </div>
                <div className="mb-4">
                    <Label>
                        Address <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                        value={data.address.line_one}
                        onChange={(e) => {
                            setData('address.line_one', e.target.value);
                        }}
                        placeholder="Street address, P.O. box, company name, c/o"
                    />
                    <InputError>{errors['address.line_one']}</InputError>
                </div>
                <div className="mb-4">
                    <Label>Postcode</Label>
                    <Input
                        type="text"
                        value={data.address.postcode}
                        onChange={(e) => {
                            setData('address.postcode', e.target.value);
                        }}
                    />
                    <InputError>{errors['address.postcode']}</InputError>
                </div>
                <div className="mb-4">
                    <Label>Delivery Instructions</Label>
                    <Textarea
                        value={data.address.delivery_instructions || ''}
                        onChange={(e) => {
                            setData('address.delivery_instructions', e.target.value);
                        }}
                        placeholder="Special delivery instructions"
                    />
                    <InputError>{errors['address.delivery_instructions']}</InputError>
                </div>
                <div className="mb-4">
                    <Label>Contact Email</Label>
                    <Input
                        type="email"
                        value={data.address.contact_email || ''}
                        onChange={(e) => {
                            setData('address.contact_email', e.target.value);
                        }}
                        placeholder="Email for contact"
                    />
                    <InputError>{errors['address.contact_email']}</InputError>
                </div>
                <div className="mb-4">
                    <Label>Contact Phone</Label>
                    <Input
                        type="tel"
                        value={data.address.contact_phone || ''}
                        onChange={(e) => {
                            setData('address.contact_phone', e.target.value);
                        }}
                        placeholder="Phone number for contact"
                    />
                    <InputError>{errors['address.contact_phone']}</InputError>
                </div>
                <div className="flex justify-end">
                    <Button disabled={processing} onClick={handleSubmit}>
                        {processing ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}

export default CustomerProfilePage;
