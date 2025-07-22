import { SVGAttributes } from 'react';
import AppLogoIcon from './app-logo-icon';

export default function AppLogo(props: SVGAttributes<SVGElement>) {
    return (
        <>
            <AppLogoIcon {...props} />
        </>
    );
}
