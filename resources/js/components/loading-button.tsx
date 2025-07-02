import { VariantProps } from 'class-variance-authority';
import { LoaderCircle } from 'lucide-react';
import { Button, buttonVariants } from './ui/button';

type LoadingButtonProps = {
    loading?: boolean;
} & React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
        asChild?: boolean;
    };
function LoadingButton({ loading, children, ...props }: LoadingButtonProps) {
    return (
        <Button disabled={loading} {...props}>
            {loading && <LoaderCircle className="mr-2 size-4 animate-spin" />}
            {children}
        </Button>
    );
}

export default LoadingButton;
