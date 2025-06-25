import AppLogo from './app-logo';

function AppFooter() {
    return (
        <div className="mx-4 mt-32">
            <div className="grid md:grid-cols-5">
                <div className="flex items-center">
                    <AppLogo />
                </div>
                <div>ABOUT</div>
                <div>INFORMATIONS</div>
                <div>MARKETPLACE</div>
                <div>CONTACTS</div>
            </div>
            <div>
                <div className="mt-4 text-center text-sm text-gray-500">&copy; {new Date().getFullYear()} IDP Hub. All rights reserved.</div>
            </div>
        </div>
    );
}

export default AppFooter;
