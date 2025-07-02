import AddressForm from '@/components/address-form';
import AppLogo from '@/components/app-logo';
import CartLineCard from '@/components/cart-line-card';
import Heading from '@/components/heading';
import LoadingButton from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/price';
import { Address } from '@/types/address';
import { Cart } from '@/types/cart';
import { Country } from '@/types/country';
import { ShippingOption } from '@/types/shipping';
import { useForm } from '@inertiajs/react';
import parse from 'html-react-parser';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface CreateOrderPageProps {
    addresses: Address[];
    countries: Country[];
    cart: Cart;
    shippingOptions?: ShippingOption[]; // Adjust type as needed
}
function CreateOrderPage({ addresses, countries, cart, shippingOptions }: CreateOrderPageProps) {
    const [openAddAddressModal, setOpenAddAddressModal] = useState<boolean>(false);
    const [openEditAddressModal, setOpenEditAddressModal] = useState<boolean>(false);

    const { data, setData, post, put, reset, processing, errors } = useForm<Omit<Address, 'id'>>();

    const handleAddAddress = () => {
        post(route('address.store'), {
            onSuccess: () => {
                toast.success('Address added successfully');
                setOpenAddAddressModal(false); // Close the modal after successful addition
                reset(); // Reset the form data
            },
            onError: (errors) => {
                console.error('Error adding address:', errors);
                toast.error('Failed to add address');
            },
        });
    };

    const handleUpdateAddress = (addressId: number) => {
        put(route('address.update', addressId), {
            onSuccess: () => {
                toast.success('Address updated successfully');
                setOpenEditAddressModal(false); // Close the modal after successful update
                reset(); // Reset the form data
            },
            onError: (errors) => {
                console.error('Error updating address:', errors);
                toast.error('Failed to update address');
            },
        });
    };

    const handleSetAddress = (addressId: number) => {
        const selectedAddress = addresses.find((a) => a.id === addressId);
        if (selectedAddress) {
            put(route('cart.set-address', selectedAddress.id), {
                onSuccess: () => {
                    toast.success('Address selected successfully');
                },
                onError: (errors) => {
                    console.error('Error changing address:', errors);
                    toast.error('Failed to set address');
                },
            });
        }
    };

    const handleSetShippingOption = (identifier: string) => {
        put(route('cart.set-shipping-option', identifier), {
            onSuccess: () => {
                toast.success('Shipping option selected successfully');
            },
            onError: (errors) => {
                console.error('Error changing shipping option:', errors);
                toast.error('Failed to change shipping option');
            },
        });
    }

    const handleCreateOrder = () => {
        post(route('order.store'), {
            onSuccess: () => {
                toast.success('Order created successfully');
            },
            onError: (errors) => {
                console.error('Error creating order:', errors);
                toast.error(errors.cart);
            },
        });
    };

    return (
        <div>
            <div className="grid h-20 grid-cols-[auto_1fr_auto] place-items-center border-b px-4">
                <Button variant="ghost" onClick={() => window.history.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center justify-center">
                    <AppLogo />
                </div>
            </div>
            <div className="container mx-auto grid gap-10 p-4 md:grid-cols-[3fr_2fr]">
                <div className="flex flex-col gap-4">
                    <Heading title="Address Details" description="Select shipping address" />
                    <Dialog open={openAddAddressModal} onOpenChange={setOpenAddAddressModal}>
                        <DialogTrigger asChild>
                            <Button className="mr-auto">Add New Address</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Address</DialogTitle>
                                <DialogDescription>Edit the address details below and save your changes.</DialogDescription>
                            </DialogHeader>
                            <AddressForm data={data} setData={setData} countries={countries} errors={errors} />
                            <LoadingButton loading={processing} onClick={handleAddAddress}>
                                Save Address
                            </LoadingButton>
                        </DialogContent>
                    </Dialog>
                    <RadioGroup
                        value={cart?.shipping_address?.meta?.address_id?.toString() || ''}
                        onValueChange={(value) => {
                            const selectedAddress = addresses.find((a) => a.id.toString() === value);
                            if (selectedAddress) {
                                handleSetAddress(selectedAddress.id);
                            }
                        }}
                    >
                        {addresses.map((address) => (
                            <Card key={address.id} className="mb-2">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value={address.id.toString()} />
                                        <div>
                                            {`${address.first_name} ${address.last_name}`}
                                            <div className="text-sm text-muted-foreground">
                                                {address.city}, {address.state}{' '}
                                            </div>
                                            <div className="text-sm">{address.line_one}</div>
                                        </div>
                                    </div>
                                    <CardAction>
                                        <Dialog open={openEditAddressModal} onOpenChange={setOpenEditAddressModal}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="mt-2 w-full" onClick={() => setData(address)}>
                                                    Edit
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Edit Address</DialogTitle>
                                                    <DialogDescription>Edit the address details below and save your changes.</DialogDescription>
                                                </DialogHeader>
                                                <AddressForm data={data} setData={setData} countries={countries} errors={errors} />
                                                <LoadingButton loading={processing} onClick={() => handleUpdateAddress(address.id)}>
                                                    Save Changes
                                                </LoadingButton>
                                            </DialogContent>
                                        </Dialog>
                                    </CardAction>
                                </CardHeader>
                            </Card>
                        ))}
                    </RadioGroup>
                    <Separator />
                    <Heading title="Shipping Options" description="Select a shipping option for your order" />
                    <RadioGroup
                        value={cart?.shipping_option?.identifier || ''}
                        onValueChange={(handleSetShippingOption)}
                    >
                        {shippingOptions?.map((option) => (
                            <Card key={option.identifier} className="mb-2">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem value={option.identifier} />
                                        <div>
                                            <div className="font-medium">{option.name}</div>
                                            <div className="text-sm text-muted-foreground">{parse(option.description)}</div>
                                            <div className="text-sm font-medium">{formatPrice(option.price)}</div>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </RadioGroup>
                </div>
                <div>
                    <Card>
                        <CardHeader>{cart?.lines?.map((line) => <CartLineCard key={line.id} line={line} />)}</CardHeader>
                        <Separator />
                        <CardContent>
                            <div>
                                <span className="text-sm font-medium">Subtotal</span>
                                <span className="float-right text-sm font-medium">{formatPrice(cart?.calculation?.subTotal)}</span>
                            </div>
                            <div>
                                <span className="text-sm font-medium">Discount</span>
                                <span className="float-right text-sm font-medium">{formatPrice(cart?.calculation?.discountTotal)}</span>
                            </div>
                            <Separator />
                            <div className="mt-2">
                                <span className="text-sm font-medium">Subtotal Discounted</span>
                                <span className="float-right text-sm font-medium">{formatPrice(cart?.calculation?.subTotalDiscounted)}</span>
                            </div>
                            <div className="mt-2">
                                <span className="text-sm font-medium">Shipping</span>
                                <span className="float-right text-sm font-medium">{formatPrice(cart?.calculation?.shippingTotal)}</span>
                            </div>
                            <div className="mt-2">
                                <span className="text-sm font-medium">Tax</span>
                                <span className="float-right text-sm font-medium">{formatPrice(cart?.calculation?.taxTotal)}</span>
                            </div>
                            <Separator />
                            <div className="mt-2">
                                <span className="text-sm font-medium">Total Payment</span>
                                <span className="float-right font-semibold">{formatPrice(cart?.calculation?.total)}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <LoadingButton loading={processing} className="w-full" onClick={handleCreateOrder}>
                                Order Now
                            </LoadingButton>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default CreateOrderPage;
