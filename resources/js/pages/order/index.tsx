import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

function OrderPage() {
    const { cart } = usePage<SharedData>().props.auth;

    console.log('Cart Data:', cart);

    return (
        <div>
            <div className="grid h-20 grid-cols-[auto_1fr_auto] place-items-center border-b px-4">
                <Button variant="ghost" onClick={() => window.history.back()}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center justify-center">
                    <AppLogo/>
                </div>
            </div>
            <div className='grid md:grid-cols-[3fr_2fr] gap-4 p-4'>
                
            </div>
        </div>
    );
}

export default OrderPage;
