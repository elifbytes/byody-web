import AppLogo from '@/components/app-logo';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SharedData } from '@/types';
import { Customer } from '@/types/customer';
import { usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface CreateOrderPageProps {
    customer: Customer;
}
function CreateOrderPage({ customer }: CreateOrderPageProps) {
    const { cart } = usePage<SharedData>().props.auth;

    console.log(customer, cart);

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
            <div className="grid gap-4 p-4 md:grid-cols-[3fr_2fr] container mx-auto">
                <div>
                    <Heading title="Address Details" />
                </div>
                <div>
                    <Card>
                        <CardContent>
                            asd
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default CreateOrderPage;
