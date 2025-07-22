import AppLogoIcon from './app-logo-icon';

interface AppLogoProps {
    className?: string;
}
export default function AppLogo({ className }: AppLogoProps) {
    return (
        <>
            <AppLogoIcon className={className} />
        </>
    );
}
