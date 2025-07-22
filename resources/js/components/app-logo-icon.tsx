import { ShoppingBagIcon } from 'lucide-react';
import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: React.ImgHTMLAttributes<HTMLImageElement>) {
    const isDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const logoPath = isDark ? '/vendor/lunarpanel/lunar-logo.svg' : '/vendor/lunarpanel/lunar-logo-dark.svg';
    return (
        <img
            src={logoPath}
            alt="Logo"
            style={{ height: '70px', width: 'auto', display: 'block', maxWidth: '100%' }}
            {...props}
        />
    );
}
