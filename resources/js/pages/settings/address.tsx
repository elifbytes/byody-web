import AddressForm from '@/components/address-form';
import DeleteButton from '@/components/delete-button';
import HeadingSmall from '@/components/heading-small';
import LoadingButton from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { Address } from '@/types/address';
import { Country } from '@/types/country';
import { Head, useForm } from '@inertiajs/react';
import { Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';

interface AddressProps {
    addresses?: Address[];
    countries: Country[];
}
export default function AddressPage({ addresses, countries }: AddressProps) {
    const { data, setData, post, put, transform, reset, processing, errors } = useForm<Omit<Address, 'id'>>({
        contact_email: '',
        first_name: '',
        last_name: '',
        contact_phone: '',
        country_id: undefined,
        state: '',
        city: '',
        postcode: '',
        line_one: '',
        shipping_default: false,
        billing_default: false,
    });

    const handleAddAddress = () => {
        post(route('address.store'), {
            onSuccess: () => {
                toast.success('Address added successfully');
                reset(); // Reset the form data
            },
            onError: (errors) => {
                console.error('Error adding address:', errors);
                toast.error('Failed to add address');
            },
            preserveState: false,
        });
    };

    const handleUpdateAddress = (addressId: number) => {
        put(route('address.update', addressId), {
            onSuccess: () => {
                toast.success('Address updated successfully');
            },
            onError: (errors) => {
                console.error('Error updating address:', errors);
                toast.error('Failed to update address');
            },
            preserveState: false,
        });
    };

    return (
        <AppLayout>
            <Head title="Address settings" />
            <SettingsLayout>
                <HeadingSmall title="Address Settings" description="Manage your addresses for shipping and billing." />
                <Dialog>
                    <DialogTrigger asChild>
                        <Button onClick={() => reset()}>Add New Address</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Address</DialogTitle>
                            <DialogDescription>Please fill out the form below to add a new address.</DialogDescription>
                        </DialogHeader>
                        <ScrollArea className="h-[calc(100vh-200px)]">
                            <AddressForm data={data} setData={setData} countries={countries} errors={errors} />
                        </ScrollArea>
                        <LoadingButton loading={processing} onClick={handleAddAddress}>
                            Save Address
                        </LoadingButton>
                    </DialogContent>
                </Dialog>
                {addresses && addresses.length > 0 ? (
                    <RadioGroup
                        value={addresses.find((a) => a.billing_default)?.id.toString()}
                        onValueChange={(value) => {
                            const selectedAddress = addresses.find((a) => a.id.toString() === value);
                            if (selectedAddress) {
                                transform(() => ({
                                    ...selectedAddress,
                                    shipping_default: true,
                                    billing_default: true,
                                }));
                                handleUpdateAddress(selectedAddress.id);
                            }
                        }}
                    >
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[50px]">Primary</TableHead>
                                    <TableHead className="text-center">Address</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {addresses.map((address) => (
                                    <TableRow key={address.id} className="border-b-0 hover:bg-background">
                                        <TableCell>
                                            <RadioGroupItem value={address.id.toString()} />
                                        </TableCell>
                                        <TableCell>
                                            <Card>
                                                <CardHeader>
                                                    <CardTitle>{`${address.first_name} ${address.last_name}`}</CardTitle>
                                                    <CardDescription>
                                                        {address.city} {address.country?.name}
                                                        <div>{address.line_one}</div>
                                                    </CardDescription>
                                                    <CardAction>
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button variant="ghost" onClick={() => setData(address)}>
                                                                    <Edit />
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Edit Address</DialogTitle>
                                                                    <DialogDescription>
                                                                        Please update the form below to edit the address.
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <ScrollArea className="h-[calc(100vh-200px)]">
                                                                    <AddressForm
                                                                        data={data}
                                                                        setData={setData}
                                                                        countries={countries}
                                                                        errors={errors}
                                                                    />
                                                                </ScrollArea>
                                                                <LoadingButton loading={processing} onClick={() => handleUpdateAddress(address.id)}>
                                                                    Save Address
                                                                </LoadingButton>
                                                            </DialogContent>
                                                        </Dialog>
                                                        <DeleteButton title="Address" route={route('address.destroy', address.id)}>
                                                            <Button variant="ghost" size="sm">
                                                                <Trash className="text-destructive" />
                                                            </Button>
                                                        </DeleteButton>
                                                    </CardAction>
                                                </CardHeader>
                                            </Card>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </RadioGroup>
                ) : (
                    <div className="text-center text-muted-foreground">No addresses found. Please add an address to continue.</div>
                )}
            </SettingsLayout>
        </AppLayout>
    );
}
