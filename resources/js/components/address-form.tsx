import countryService from '@/services/country-service';
import { Address } from '@/types/address';
import { Country, State } from '@/types/country';
import { useCallback, useEffect, useState } from 'react';
import InputError from './input-error';
import { Combobox } from './ui/combo-box';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface AddressFormProps {
    countries: Country[];
    setData: <K extends keyof Omit<Address, 'id'>>(key: K, value: Omit<Address, 'id'>[K]) => void;
    data: Omit<Address, 'id'>;
    errors: Partial<
        Record<
            | 'contact_email'
            | 'meta'
            | 'title'
            | 'first_name'
            | 'last_name'
            | 'contact_phone'
            | 'country_id'
            | 'city'
            | 'state'
            | 'line_one'
            | 'customer_id'
            | 'company_name'
            | 'line_two'
            | 'line_three'
            | 'postcode'
            | 'delivery_instructions'
            | 'shipping_default'
            | 'billing_default'
            | 'country',
            string
        >
    >;
}
function AddressForm({ countries, setData, data, errors }: AddressFormProps) {
    const [states, setStates] = useState<State[]>([]);

    const handleCountryChange = useCallback(async () => {
        if (data.country_id) {
            const states = await countryService.getStates(data.country_id);
            setStates(states);
        }
    }, [data.country_id]);

    useEffect(() => {
        handleCountryChange();
    }, [handleCountryChange]);

    return (
        <div className="grid gap-2">
            <div>
                <Label>Email</Label>
                <Input
                    placeholder="Email Address (optional)"
                    className="w-full"
                    value={data.contact_email}
                    onChange={(e) => setData('contact_email', e.target.value)}
                />
                <InputError message={errors.contact_email} />
            </div>
            <div>
                <Label>First Name</Label>
                <Input placeholder="First Name" className="w-full" value={data.first_name} onChange={(e) => setData('first_name', e.target.value)} />
                <InputError message={errors.first_name} />
            </div>
            <div>
                <Label>Last Name</Label>
                <Input placeholder="Last Name" className="w-full" value={data.last_name} onChange={(e) => setData('last_name', e.target.value)} />
                <InputError message={errors.last_name} />
            </div>
            <div>
                <Label>Phone Number</Label>
                <Input
                    placeholder="Phone Number"
                    className="w-full"
                    value={data.contact_phone}
                    onChange={(e) => setData('contact_phone', e.target.value)}
                />
                <InputError message={errors.contact_phone} />
            </div>
            <div>
                <Label>Country</Label>
                <Combobox
                    placeholder="Country"
                    items={countries.map((country) => {
                        return {
                            value: country.id.toString(),
                            label: country.name,
                        };
                    })}
                    value={data.country_id?.toString() || null}
                    onChange={(value) => setData('country_id', value ? parseInt(value, 10) : undefined)}
                />
                <InputError message={errors.country_id} />
            </div>
            <div>
                <Label>State</Label>
                <Combobox
                    placeholder="State"
                    items={states.map((state) => {
                        return {
                            value: state.name,
                            label: state.name,
                        };
                    })}
                    value={data.state || null}
                    onChange={(value) => setData('state', value || '')}
                />
                <InputError message={errors.state} />
            </div>
            <div>
                <Label>City</Label>
                <Input placeholder="City" className="w-full" value={data.city} onChange={(e) => setData('city', e.target.value)} />
                <InputError message={errors.city} />
            </div>
            <div>
                <Label>Post Code</Label>
                <Input
                    placeholder="Post Code"
                    className="w-full"
                    value={data.postcode}
                    onChange={(e) => setData('postcode', e.target.value)}
                />
                <InputError message={errors.postcode} />
            </div>
            <div>
                <Label>Address Details</Label>
                <Textarea
                    placeholder="Address Details"
                    className="w-full"
                    value={data.line_one}
                    onChange={(e) => setData('line_one', e.target.value)}
                />
                <InputError message={errors.line_one} />
            </div>
        </div>
    );
}

export default AddressForm;
