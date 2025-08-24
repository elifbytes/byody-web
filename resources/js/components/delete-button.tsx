import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { Trash } from 'lucide-react';
import { PropsWithChildren, useState } from 'react';
import { toast } from 'sonner';
import { Button } from './ui/button';
import LoadingButton from './loading-button';

interface DeleteButtonProps {
    title: string;
    description?: string;
    route: string;
}

export default function DeleteButton({ title, description, route, children }: PropsWithChildren<DeleteButtonProps>) {
    const [open, setOpen] = useState<boolean>(false);
    const { delete: destroy, processing } = useForm();
    const handleDelete = () => {
        destroy(route, {
            onSuccess: () => {
                toast.success(`${title} deleted successfully`);
                setOpen(false);
            },
            onError: () => {
                toast.error(`Failed to delete ${title}`);
            },
            preserveScroll: true,
            preserveState: false,
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children || (
                    <Button variant="destructive">
                        <Trash className="h-4 w-4" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Delete {title}</DialogTitle>
                    <DialogDescription>
                        {description || `Are you sure you want to delete this ${title}? This action cannot be undone.`}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Batal</Button>
                    </DialogClose>
                    <LoadingButton variant="destructive" onClick={handleDelete} loading={processing}>
                        Hapus
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
