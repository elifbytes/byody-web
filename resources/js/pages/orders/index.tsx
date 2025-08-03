import Heading from '@/components/heading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { usePrice } from '@/hooks/use-price';
import AppLayout from '@/layouts/app-layout';
import { formatDate } from '@/lib/utils';
import { Order, OrderStatus } from '@/types/order';
import { Head, router } from '@inertiajs/react';
import { LinkIcon } from 'lucide-react';
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
        <AppLayout>
            <Head title="Orders" />
            <div className="mx-auto w-full max-w-4xl">
                <div className="p-4">
                    <Heading title="Orders" description="Manage your orders" />
                </div>
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
            </div>
        </AppLayout>
    );
}

export default OrderPage;
