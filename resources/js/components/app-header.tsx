import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Menu, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';
import Cart from './cart';
import SearchDialog from './search-dialog';

const mainNavItems: NavItem[] = [
    // {
    //     title: 'Home',
    //     href: '/',
    // },
    {
        title: 'About',
        href: '/about',
    },
];

const activeItemStyles = 'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

interface AppHeaderProps {
    breadcrumbs?: BreadcrumbItem[];
}

export function AppHeader({ breadcrumbs = [] }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth, collections } = page.props;

    const [openSearch, setOpenSearch] = useState<boolean>(false);

    const getInitials = useInitials();

    //navbar setting animation
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <div
                className={cn(
                    'sticky top-0 z-50 transition-colors duration-300',
                    'bg-transparent backdrop-blur-sm'
                )}
            >
                <div style={{backgroundColor: '#301D17'}} className="flex justify-center bg-primary p-3 text-background">HOLA BEFRIENDS! BOOST YOUR CONFIDENCE US</div>
                <div className="relative flex h-16 items-center px-4">
                    {/* Left side - Mobile Menu + Desktop Navigation */}
                    <div className="flex items-center">
                        {/* Mobile Menu */}
                        <div className="lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="mr-2 h-[34px] w-[34px] text-black hover:bg-black/10 dark:text-white dark:hover:bg-white/10">
                                        <Menu className="h-5 w-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="flex h-full w-64 flex-col items-stretch justify-between bg-sidebar">
                                    <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                                    <SheetHeader className="flex justify-start text-left">
                                        <AppLogoIcon className="h-6 w-6 text-black dark:text-white" />
                                    </SheetHeader>
                                    <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                                        <div className="flex h-full flex-col justify-between text-sm">
                                            <div className="flex flex-col space-y-4">
                                                {mainNavItems.map((item) => (
                                                    <Link key={item.title} href={item.href} className="flex items-center space-x-2 font-medium">
                                                        {item.icon && <Icon iconNode={item.icon} className="h-5 w-5" />}
                                                        <span>{item.title}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Desktop Navigation - Moved to left */}
                        <div className="hidden h-full items-center space-x-6 lg:flex">
                            <NavigationMenu className="flex h-full items-stretch" viewport={false}>
                                <NavigationMenuList className="flex h-full items-stretch space-x-2">
                                    {mainNavItems.map((item, index) => (
                                        <NavigationMenuItem key={index} className="relative flex h-full items-center">
                                            <Link
                                                href={item.href}
                                                className={cn(
                                                    navigationMenuTriggerStyle(),
                                                    page.url === item.href && activeItemStyles,
                                                    'h-9 cursor-pointer px-3 text-black hover:bg-black/10 hover:text-black dark:text-white dark:hover:bg-white/10 dark:hover:text-white',
                                                )}
                                            >
                                                {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
                                                {item.title}
                                            </Link>
                                        </NavigationMenuItem>
                                    ))}
                                    {collections.map((collection) =>
                                        (collection.children?.length || 0) > 0 ? (
                                            <NavigationMenuItem key={collection.id} className="relative flex h-full items-center">
                                                <NavigationMenuTrigger className="text-black hover:bg-black/10 hover:text-black dark:text-white dark:hover:bg-white/10 dark:hover:text-white">{collection.attribute_data?.name.en}</NavigationMenuTrigger>
                                                <NavigationMenuContent>
                                                    <ul className="grid w-[300px] gap-4">
                                                        <li>
                                                            {collection.children?.map((child) => (
                                                                <NavigationMenuLink asChild key={child.id}>
                                                                    <Link href={`/products?filter[collections]=${child.default_url?.slug}`}>
                                                                        <div className="font-medium">{child.attribute_data?.name.en}</div>
                                                                    </Link>
                                                                </NavigationMenuLink>
                                                            ))}
                                                        </li>
                                                    </ul>
                                                </NavigationMenuContent>
                                            </NavigationMenuItem>
                                        ) : (
                                            <NavigationMenuItem key={collection.id} className="relative flex h-full items-center">
                                                <NavigationMenuLink asChild>
                                                    <Link
                                                        href={`/products?filter[collections]=${collection.default_url?.slug}`}
                                                        className={cn(
                                                            navigationMenuTriggerStyle(),
                                                            page.url === `/products?filter[collections]=${collection.default_url?.slug}` &&
                                                                activeItemStyles,
                                                            'h-9 px-3 text-black hover:bg-black/10 hover:text-black dark:text-white dark:hover:bg-white/10 dark:hover:text-white',
                                                        )}
                                                    >
                                                        {collection.attribute_data?.name.en}
                                                    </Link>
                                                </NavigationMenuLink>
                                            </NavigationMenuItem>
                                        ),
                                    )}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                    </div>

                    {/* Center - Logo */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                        <Link href="/" prefetch className="flex items-center space-x-2">
                            <AppLogo />
                        </Link>
                    </div>

                    {/* Right side - Search, Cart, User */}
                    <div className="ml-auto flex items-center space-x-2">
                        <Button variant="ghost" size="icon" className="group h-9 w-9 cursor-pointer text-black hover:bg-black/10 dark:text-white dark:hover:bg-white/10" onClick={() => setOpenSearch(true)}>
                            <Search className="!size-5 opacity-80 group-hover:opacity-100" />
                        </Button>
                        <SearchDialog open={openSearch} onOpenChange={setOpenSearch} />
                        <Cart />
                        {auth.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="size-10 rounded-full p-1 hover:bg-black/10 dark:hover:bg-white/10">
                                        <Avatar className="size-8 overflow-hidden rounded-full">
                                            <AvatarImage src={auth.user.avatar} alt={auth.user.name} />
                                            <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                                {getInitials(auth.user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
                                    <UserMenuContent user={auth.user} />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link href="/login" className="flex items-center space-x-2">
                                <Button variant="outline" size="sm" className="border-black text-black hover:bg-black hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black">
                                    <span>Login</span>
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-sidebar-border/70">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
