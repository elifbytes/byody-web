import { ScrollArea } from '@/components/ui/scroll-area';
import { getCartLinesPrice, getProductVariantPrice } from '@/lib/price';
import { SharedData } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Minus, Plus, ShoppingCartIcon, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from './ui/badge';
import { Button, buttonVariants } from './ui/button';
import { NotificationBadge } from './ui/notification-badge';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

function Cart() {
    const { auth } = usePage<SharedData>().props;
    const {
        put,
        delete: destroy,
        transform,
        processing,
    } = useForm({
        cart_line_id: 0,
        quantity: 0,
    });

    console.log('Cart data:', auth.cart);

    const handleUpdateQuantity = (lineId: number, quantity: number) => {
        transform((data) => ({
            ...data,
            cart_line_id: lineId,
            quantity: quantity,
        }));

        put(route('cart.update', auth.cart?.id), {
            onSuccess: () => {
                toast.success('Cart updated successfully');
            },
            onError: (errors) => {
                console.error(errors);
                toast.error('Failed to update cart');
            },
        });
    };

    const handleRemoveItem = (lineId: number) => {
        transform((data) => ({
            ...data,
            cart_line_id: lineId,
        }));
        destroy(route('cart.destroy', auth.cart?.id), {
            onSuccess: () => {
                toast.success('Item removed from cart');
            },
            onError: (errors) => {
                console.error(errors);
                toast.error('Failed to remove item from cart');
            },
        });
    };

    return (
        <Sheet>
            <NotificationBadge label={auth.cart?.lines?.reduce((p, c) => p + c.quantity, 0)} show={(auth.cart?.lines?.length ?? 0) > 0}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="group h-9 w-9 cursor-pointer">
                        <ShoppingCartIcon className="!size-5 opacity-80 group-hover:opacity-100" />
                    </Button>
                </SheetTrigger>
            </NotificationBadge>
            <SheetContent>
                <SheetHeader className="border-b border-neutral-200">
                    <SheetTitle>Cart</SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100%-200px)] w-full px-4">
                    {auth.cart?.lines?.map((line) => (
                        <div key={line.id} className="grid grid-cols-[1fr_3fr] gap-2 border-b border-neutral-200 py-2">
                            <div>
                                {line.purchasable?.product?.thumbnail && (
                                    <img
                                        className="rounded"
                                        src={line.purchasable?.product?.thumbnail.original_url}
                                        alt={line.purchasable?.product?.attribute_data?.name.en}
                                    />
                                )}
                            </div>
                            <div className="flex flex-col space-y-2">
                                <div>{line.purchasable?.product?.attribute_data?.name.en}</div>
                                <div className="flex gap-1">
                                    {line.purchasable?.values?.map((value) => (
                                        <Badge key={value.id} variant="outline">
                                            {value?.name.en}
                                        </Badge>
                                    ))}
                                </div>
                                <span className="text-sm font-medium">{`${line.quantity} x ${getProductVariantPrice(line.purchasable!)}`}</span>
                            </div>
                            <div className="col-span-2 flex items-center justify-end space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={processing}
                                    onClick={() => {
                                        handleRemoveItem(line.id);
                                    }}
                                >
                                    <Trash className="text-destructive" />
                                </Button>
                                <div className="flex items-center rounded-lg border">
                                    <Button
                                        variant="outline"
                                        className="rounded-r-none border-0"
                                        size="sm"
                                        disabled={line.quantity <= 1 || processing}
                                        onClick={() => handleUpdateQuantity(line.id, line.quantity - 1)}
                                    >
                                        <Minus />
                                    </Button>
                                    <div className="mx-2 text-sm">{line.quantity}</div>
                                    <Button
                                        variant="outline"
                                        className="rounded-l-none border-0"
                                        size="sm"
                                        disabled={processing}
                                        onClick={() => handleUpdateQuantity(line.id, line.quantity + 1)}
                                    >
                                        <Plus />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {auth.cart?.lines?.length === 0 && <div className="text-center text-sm text-neutral-500">Your cart is empty.</div>}
                </ScrollArea>
                {auth.cart?.lines && auth.cart.lines.length > 0 && (
                    <SheetFooter>
                        <div className="grid grid-cols-2 items-center gap-4">
                            <p className="text-sm font-medium">Total:</p>
                            <p className="text-right text-lg font-bold">{getCartLinesPrice(auth.cart.lines)}</p>
                        </div>
                        <Link className={buttonVariants({ className: 'mt-4 w-full' })} href={route('order.create')}>
                            Checkout
                        </Link>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
}

export default Cart;
