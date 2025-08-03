import { ScrollArea } from '@/components/ui/scroll-area';
import { usePrice } from '@/hooks/use-price';
import { SharedData } from '@/types';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Minus, Plus, ShoppingCartIcon, Trash } from 'lucide-react';
import { toast } from 'sonner';
import AppLogoIcon from './app-logo-icon';
import CartLineCard from './cart-line-card';
import { Button, buttonVariants } from './ui/button';
import { NotificationBadge } from './ui/notification-badge';
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

function Cart() {
    const { getCartLinesPrice } = usePrice();
    const { cart } = usePage<SharedData>().props;

    const {
        put,
        delete: destroy,
        transform,
        processing,
    } = useForm({
        cart_line_id: 0,
        quantity: 0,
    });

    const handleUpdateQuantity = (lineId: number, quantity: number) => {
        transform((data) => ({
            ...data,
            cart_line_id: lineId,
            quantity: quantity,
        }));

        put(route('carts.update', cart?.id), {
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
        destroy(route('carts.destroy', cart?.id), {
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
            <NotificationBadge label={cart?.lines?.reduce((p, c) => p + c.quantity, 0)} show={(cart?.lines?.length ?? 0) > 0}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="group h-9 w-9 cursor-pointer text-background">
                        <ShoppingCartIcon className="!size-5 opacity-80 group-hover:opacity-100" />
                    </Button>
                </SheetTrigger>
            </NotificationBadge>
            <SheetContent>
                <SheetHeader className="border-b border-neutral-200">
                    <SheetTitle>Cart</SheetTitle>
                </SheetHeader>
                {(cart?.lines?.length || 0) > 0 ? (
                    <ScrollArea className="h-[calc(100%-200px)] w-full px-4">
                        {cart?.lines?.map((line) => (
                            <div key={line.id} className="border-b border-neutral-200 py-2">
                                <CartLineCard line={line} key={line.id} />
                                <div className="col-span-2 mt-2 flex items-center justify-end space-x-2">
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
                    </ScrollArea>
                ) : (
                    <div className="flex h-full flex-col items-center justify-center text-center text-sm text-neutral-500">
                        <AppLogoIcon />
                        <p className="mt-4">Your cart is empty.</p>
                    </div>
                )}
                {cart?.lines && cart.lines.length > 0 && (
                    <SheetFooter>
                        <div className="grid grid-cols-2 items-center gap-4">
                            <p className="text-sm font-medium">Total:</p>
                            <p className="text-right text-lg font-bold">{getCartLinesPrice(cart.lines)}</p>
                        </div>
                        <Link className={buttonVariants({ className: 'mt-4 w-full' })} href={route('orders.create')}>
                            Checkout
                        </Link>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    );
}

export default Cart;
