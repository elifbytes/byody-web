import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LogIn, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';

export function LoginRegisterPopup() {
    const { auth } = usePage<SharedData>().props;
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Only show popup if:
        // 1. User is not authenticated
        // 2. Current URL is home page
        // 3. User hasn't seen the popup before
        if (!auth.user) {
            const currentUrl = window.location.pathname;
            const isHomePage = currentUrl === '/' || currentUrl === '/home';

            if (isHomePage) {
                const hasSeenPopup = localStorage.getItem('hasSeenLoginPopup');
                if (!hasSeenPopup) {
                    // Add small delay to ensure page is fully loaded
                    const timer = setTimeout(() => {
                        setIsOpen(true);
                    }, 1000);

                    return () => clearTimeout(timer);
                }
            }
        }
    }, [auth.user]);

    const handleClose = () => {
        setIsOpen(false);
        // Remember that user has seen the popup
        localStorage.setItem('hasSeenLoginPopup', 'true');
    };

    // Don't show popup if user is already authenticated
    if (auth.user) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center">Selamat Datang di Byody!</DialogTitle>
                    <DialogDescription className="text-center">
                        Bergabunglah dengan kami untuk mendapatkan pengalaman berbelanja yang lebih baik dan penawaran eksklusif.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <Button asChild className="h-12 w-full" size="lg">
                        <Link href="/login" className="flex items-center gap-2">
                            <LogIn className="h-4 w-4" />
                            Masuk ke Akun Saya
                        </Link>
                    </Button>

                    <Button asChild variant="outline" className="h-12 w-full" size="lg">
                        <Link href="/login" className="flex items-center gap-2">
                            <UserPlus className="h-4 w-4" />
                            Daftar Akun Baru
                        </Link>
                    </Button>
                </div>

                <div className="text-center">
                    <Button variant="ghost" onClick={handleClose} className="text-sm text-muted-foreground hover:text-foreground">
                        Lewati untuk sekarang
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
