import AddressForm from '@/components/address-form';
import AppLogo from '@/components/app-logo';
import CartLineCard from '@/components/cart-line-card';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import LoadingButton from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { usePrice } from '@/hooks/use-price';
import { Address } from '@/types/address';
import { Cart, CartCalculation } from '@/types/cart';
import { Country } from '@/types/country';
import { ShippingOption } from '@/types/shipping';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ChevronRight, Ticket } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface CreateOrderPageProps {
    addresses: Address[];
    countries: Country[];
    cart: Cart;
    shippingOptions?: ShippingOption[];
    cartCalculation: CartCalculation;
    cartShippingOption?: ShippingOption;
}
export default function CreateOrderPage({ addresses, countries, cart, shippingOptions, cartCalculation, cartShippingOption }: CreateOrderPageProps) {
    const [openAddAddressModal, setOpenAddAddressModal] = useState<boolean>(false);
    const [openEditAddressModal, setOpenEditAddressModal] = useState<boolean>(false);
    const [openVoucherModal, setOpenVoucherModal] = useState<boolean>(false);
    const { formatPrice } = usePrice();

    const { data, setData, post, put, reset, processing, errors } = useForm<Omit<Address, 'id'>>();
    const {
        data: voucherData,
        setData: setVoucherData,
        post: postVoucher,
        reset: resetVoucher,
        processing: processingVoucher,
        errors: errorsVoucher,
    } = useForm<{ code: string }>({ code: '' });

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
            put(
                route('carts.set-address', {
                    addressId: selectedAddress.id,
                    cart: cart.id,
                }),
                {
                    onSuccess: () => {
                        toast.success('Address selected successfully');
                    },
                    onError: (errors) => {
                        console.error('Error setting address:', errors);
                        if (errors.address) {
                            toast.error(errors.address);
                        } else {
                            toast.error('Failed to set address');
                        }
                    },
                },
            );
        }
    };

    const handleSetShippingOption = (identifier: string) => {
        put(
            route('carts.set-shipping-option', {
                identifier,
                cart: cart.id,
            }),
            {
                onSuccess: () => {
                    toast.success('Shipping option selected successfully');
                },
                onError: (errors) => {
                    if (errors.shipping) {
                        toast.error(errors.shipping);
                    } else {
                        toast.error('Failed to change shipping option');
                    }
                },
            },
        );
    };

    const handleApplyVoucher = () => {
        if (!voucherData.code || voucherData.code.trim() === '') {
            toast.error('Please enter a voucher code');
            return;
        }
        postVoucher(route('carts.apply-voucher'), {
            onSuccess: () => {
                toast.success('Voucher applied successfully');
                resetVoucher(); // Clear the voucher code input
                setOpenVoucherModal(false); // Close the voucher modal
            },
            onError: (errors) => {
                console.error('Error applying voucher:', errors);
                toast.error('Failed to apply voucher');
            },
        });
    };

    const handleCreateOrder = () => {
        post(
            route('orders.store', {
                cart_id: cart.id,
            }),
            {
                onSuccess: () => {
                    toast.success('Order created successfully');
                },
                onError: (errors) => {
                    console.error('Error creating order:', errors);
                    toast.error(errors.cart);
                },
            },
        );
    };

    return (
        <div className="min-h-screen">
            <div className="grid h-20 grid-cols-[auto_1fr_auto] place-items-center border-b px-4">
                <Button variant="ghost" onClick={() => window.history.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center justify-center">
                    <Link href="/" prefetch className="flex items-center space-x-2">
                        <AppLogo width={70} />
                    </Link>
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
                                <DialogTitle>Add New Address</DialogTitle>
                                <DialogDescription>Fill in the address details below to add a new address to your account.</DialogDescription>
                            </DialogHeader>
                            <ScrollArea className="h-[calc(100vh-200px)]">
                                <AddressForm data={data} setData={setData} countries={countries} errors={errors} />
                            </ScrollArea>
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
                                                {address.city}, {address.country?.name}
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
                                                <ScrollArea className="h-[calc(100vh-200px)]">
                                                    <AddressForm data={data} setData={setData} countries={countries} errors={errors} />
                                                </ScrollArea>
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
                    <RadioGroup value={cartShippingOption?.identifier || ''} onValueChange={handleSetShippingOption}>
                        {shippingOptions?.map((option) => (
                            <Card key={option.identifier} className="mb-2 py-3">
                                <CardHeader>
                                    <div className="grid grid-cols-[auto_1fr] items-center gap-2">
                                        <RadioGroupItem value={option.identifier} />
                                        <div className="flex items-center justify-between gap-2">
                                            <img src={option.meta?.image || '/placeholder.svg'} alt={option.name} className="h-8 rounded-sm" />
                                            <div className="text-right">
                                                <div className="font-medium text-muted-foreground">
                                                    {option.name}{' '}
                                                    <span className="text-xs">{option.meta?.lead_time && `(${option.meta?.lead_time})`}</span>
                                                </div>
                                                <div className="text-sm font-medium">{formatPrice(option.price)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        ))}
                    </RadioGroup>
                </div>
                <div>
                    <Card>
                        <CardHeader>
                            {cart?.lines?.map((line) => <CartLineCard key={line.id} line={line} />)}
                            <Dialog open={openVoucherModal} onOpenChange={setOpenVoucherModal}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="mt-4 w-full">
                                        <div className="flex items-center gap-2">
                                            <Ticket className="h-4 w-4" />
                                            Voucher
                                        </div>
                                        <ChevronRight className="ml-auto h-4 w-4" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Apply Voucher</DialogTitle>
                                        <DialogDescription>
                                            Enter your voucher code below to apply it to your order. If you have a valid voucher, it will be applied
                                            to your cart.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <Input
                                        type="text"
                                        value={voucherData.code}
                                        onChange={(e) => setVoucherData({ code: e.target.value.toUpperCase() })}
                                        placeholder="Enter voucher code"
                                    />
                                    <InputError message={errorsVoucher.code} />
                                    <DialogFooter>
                                        <LoadingButton
                                            disabled={!voucherData.code}
                                            loading={processingVoucher}
                                            className="mt-4 w-full"
                                            onClick={handleApplyVoucher}
                                        >
                                            Apply Voucher
                                        </LoadingButton>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                            {(cartCalculation?.discountBreakdown?.length || 0) > 0 && (
                                <div className="mt-2 text-xs text-muted-foreground">
                                    <span className="font-medium">Applied Discounts:</span>
                                    <ul className="list-disc pl-4">
                                        {cartCalculation?.discountBreakdown?.map((item, index) => (
                                            <li key={index}>
                                                {item.discount.name}: {formatPrice(item.price)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </CardHeader>
                        <Separator />
                        <CardContent>
                            <div>
                                <span className="text-sm font-medium">Subtotal</span>
                                <span className="float-right text-sm font-medium">{formatPrice(cartCalculation?.subTotal)}</span>
                            </div>
                            <div>
                                <span className="text-sm font-medium">Discount</span>
                                <span className="float-right text-sm font-medium">{formatPrice(cartCalculation?.discountTotal)}</span>
                            </div>
                            <Separator />
                            <div className="mt-2">
                                <span className="text-sm font-medium">Subtotal Discounted</span>
                                <span className="float-right text-sm font-medium">{formatPrice(cartCalculation?.subTotalDiscounted)}</span>
                            </div>
                            <div className="mt-2">
                                <span className="text-sm font-medium">Shipping</span>
                                <span className="float-right text-sm font-medium">{formatPrice(cartCalculation?.shippingTotal)}</span>
                            </div>
                            <div className="mt-2">
                                <span className="text-sm font-medium">Tax</span>
                                <span className="float-right text-sm font-medium">{formatPrice(cartCalculation?.taxTotal)}</span>
                            </div>
                            <Separator />
                            <div className="mt-2">
                                <span className="text-sm font-medium">Total Payment</span>
                                <span className="float-right font-semibold">{formatPrice(cartCalculation?.total)}</span>
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
