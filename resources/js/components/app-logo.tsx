import AppLogoIcon from './app-logo-icon';

interface AppLogoProps {
    className?: string;
}
export default function AppLogo({ className }: AppLogoProps) {
    return (
        <>
            <AppLogoIcon className={className} />
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className={`mb-0.5 truncate leading-tight font-semibold ${className}`}>Byody</span>
            </div>
        </>
    );
}
