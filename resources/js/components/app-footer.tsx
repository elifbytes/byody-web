import { Instagram, MessageCircleMore, Music2 } from 'lucide-react';
import AppLogo from './app-logo';


function AppFooter() {
    return (
        <footer className="bg-[#301D17] px-6 pt-10 pb-6 text-[#d6dc9b]">
            <div className="mx-auto flex max-w-7xl flex-col items-center space-y-20 text-center">
                {/* Menu Links */}
                <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
                    <a href="#" className="hover:underline">About Us</a>
                    <a href="#" className="hover:underline">Contact Us</a>
                    <a href="#" className="hover:underline">FAQs</a>
                    <a href="#" className="hover:underline">Terms of Service</a>
                    <a href="#" className="hover:underline">Privacy Policy</a>
                    <a href="#" className="hover:underline">Refund Policy</a>
                </div>

                {/* Social Icons */}
                <div className="flex justify-center space-x-5">
                    <a href="https://shopee.co.id" target="_blank" rel="noopener noreferrer">
                        <img src="/assets/icons/shopee.png" alt="Shopee" className="h-10 w-10" />
                    </a>
                    <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                        <Music2 className="h-10 w-10" />
                    </a>
                    <a href="https://wa.me/628123456789" target="_blank" rel="noopener noreferrer">
                        <MessageCircleMore className="h-10 w-10" />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <Instagram className="h-10 w-10" />
                    </a>
                </div>

                {/* Copyright */}
                 <div className="text-xs flex items-center justify-center space-x-2">
                    <span>&copy; {new Date().getFullYear()}</span>
                    <AppLogo />
                    <span>– All rights reserved.</span>
                </div>
            </div>
        </footer>
    );
}

export default AppFooter;
