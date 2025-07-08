import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Order } from '@/types/order';
import { ArrowLeft } from 'lucide-react';

interface OrderPageProps {
    orders: Order[];
}
function OrderPage({ orders }: OrderPageProps) {
    console.log('Orders:', orders);
    
    return (
        <AppLayout>
            <div className="grid h-20 grid-cols-[auto_1fr_auto] place-items-center border-b px-4">
                <Button variant="ghost" onClick={() => window.history.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center justify-center">
                    <AppLogo />
                </div>
            </div>
            <div className="grid gap-4 p-4 md:grid-cols-[3fr_2fr]"></div>
        </AppLayout>
    );
}

export default OrderPage;
