import AppLogo from '@/components/app-logo';
import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePrice } from '@/hooks/use-price';
import { formatDate } from '@/lib/utils';
import { Order, OrderStatus } from '@/types/order';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, LinkIcon } from 'lucide-react';
import { useCallback } from 'react';

interface OrderPageProps {
    orders: Order[];
}
function OrderPage({ orders }: OrderPageProps) {
    const { formatPrice } = usePrice();
    const renderStatus = (status: OrderStatus) => {
        switch (status) {
            case 'awaiting-payment':
                return <Badge variant="secondary">Awaiting Payment</Badge>;
            case 'payment-received':
                return <Badge variant="outline">Payment Received</Badge>;
            case 'payment-offline':
                return <Badge variant="destructive">Payment Offline</Badge>;
            case 'dispatched':
                return <Badge>Dispatched</Badge>;
            default:
                return <Badge>-</Badge>;
        }
    };
    const handleOpenChange = useCallback((open: boolean) => {
        if (!open) {
            router.reload();
        }
    }, []);

    return (
        <div className="min-h-screen">
            <Head title="Orders" />
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
            <div className="container mx-auto">
                <div className="p-4">
                    <Heading title="Orders" description="Manage your orders" />
                </div>
                {orders.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{formatDate(order.placed_at)}</TableCell>
                                    <TableCell>{renderStatus(order.status)}</TableCell>
                                    <TableCell>{formatPrice(order.total)}</TableCell>
                                    <TableCell>
                                        {order.meta?.invoice_url && order.status === 'awaiting-payment' ? (
                                            <Dialog onOpenChange={handleOpenChange}>
                                                <DialogTrigger asChild>
                                                    <Button size="sm">
                                                        <LinkIcon className="h-4 w-4" /> Pay
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="w-full p-0">
                                                    <DialogHeader>
                                                        <DialogTitle className="mt-3 ml-2">Payment</DialogTitle>
                                                        <DialogDescription className="mt-3 ml-2">
                                                            Please complete your payment for order{' '}
                                                            <span className="font-semibold">#{order.reference}</span>. You can pay using the invoice
                                                            below.
                                                        </DialogDescription>
                                                    </DialogHeader>

                                                    <Card className="flex h-[80vh] w-full flex-col">
                                                        <CardContent className="flex-1 overflow-hidden p-0">
                                                            <iframe
                                                                src={order.meta.invoice_url}
                                                                className="h-full w-full rounded-b-md"
                                                                title="Invoice Viewer"
                                                            />
                                                        </CardContent>
                                                    </Card>
                                                </DialogContent>
                                            </Dialog>
                                        ) : null}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="flex flex-col items-center justify-center p-8">
                        <h1 className="mb-2 text-2xl font-semibold">No Orders Found</h1>
                        <p className="mb-4 text-gray-600">You have not placed any orders yet.</p>
                        <p className="mb-4 text-gray-500">Browse our products and start shopping to see your orders here.</p>
                        <Button className="mt-4" onClick={() => router.visit(route('products.index'))}>
                            Browse Products
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderPage;
