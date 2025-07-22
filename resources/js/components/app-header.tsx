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
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { UserMenuContent } from '@/components/user-menu-content';
import { useInitials } from '@/hooks/use-initials';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Menu, Search } from 'lucide-react';
import { useState } from 'react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';
import Cart from './cart';
import SearchDialog from './search-dialog';

const mainNavItems: NavItem[] = [
    {
        title: 'About',
        href: '/about',
    },
];

interface AppHeaderProps {
    position?: 'fixed' | 'sticky';
}

export function AppHeader({ position = 'sticky' }: AppHeaderProps) {
    const page = usePage<SharedData>();
    const { auth, collections } = page.props;

    const [openSearch, setOpenSearch] = useState<boolean>(false);

    const getInitials = useInitials();

    return (
        <>
            {position === 'fixed' && <div className="fixed top-0 z-30 h-16 w-full bg-primary"></div>}
            <div className={`${position} top-0 z-50 ${position === 'sticky' ? 'bg-primary' : 'w-full'}`}>
                <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center px-4">
                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="mr-2 h-[34px] w-[34px] text-background">
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
                                            {collections.map((collection) =>
                                                (collection.children?.length || 0) > 0 ? (
                                                    <div key={collection.id} className="flex flex-col space-y-2">
                                                        <Link href="/products" className="font-medium">
                                                            {collection.attribute_data?.name.en}
                                                        </Link>
                                                        {collection.children?.map((child) => (
                                                            <Link
                                                                key={child.id}
                                                                href={`/products?filter[collections]=${child.default_url?.slug}`}
                                                                className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                                                            >
                                                                {child.attribute_data?.name.en}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <Link
                                                        key={collection.id}
                                                        href={`/products?filter[collections]=${collection.default_url?.slug}`}
                                                        className="text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
                                                    >
                                                        {collection.attribute_data?.name.en}
                                                    </Link>
                                                ),
                                            )}
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

                    {/* Desktop Navigation */}
                    <div className="ml-6 hidden h-full items-center space-x-6 lg:flex">
                        <NavigationMenu className="flex h-full items-stretch" viewport={false}>
                            <NavigationMenuList className="flex h-full items-stretch space-x-6">
                                {collections.map((collection) =>
                                    (collection.children?.length || 0) > 0 ? (
                                        <NavigationMenuItem key={collection.id} className="relative flex h-full items-center">
                                            <NavigationMenuTrigger className="text-md bg-transparent p-0 font-normal text-background hover:bg-transparent hover:text-background hover:underline focus:bg-transparent focus:text-background data-[active=true]:bg-transparent data-[active=true]:text-accent-foreground data-[state=open]:bg-transparent">
                                                <Link href="/products">{collection.attribute_data?.name.en}</Link>
                                            </NavigationMenuTrigger>
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
                                            <Link
                                                href={`/products?filter[collections]=${collection.default_url?.slug}`}
                                                className="text-background hover:underline"
                                            >
                                                {collection.attribute_data?.name.en}
                                            </Link>
                                        </NavigationMenuItem>
                                    ),
                                )}
                                {mainNavItems.map((item, index) => (
                                    <NavigationMenuItem key={index} className="relative flex h-full items-center">
                                        <Link href={item.href} className="text-background hover:underline">
                                            {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
                                            {item.title}
                                        </Link>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <Link href="/" prefetch className="flex items-center space-x-2">
                        <AppLogo className="fill-background" width={70} />
                    </Link>

                    <div className="flex items-center justify-end space-x-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="group h-9 w-9 cursor-pointer text-background"
                            onClick={() => setOpenSearch(true)}
                        >
                            <Search className="!size-5 opacity-80 group-hover:opacity-100" />
                        </Button>
                        <SearchDialog open={openSearch} onOpenChange={setOpenSearch} />
                        <Cart />
                        {auth.user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="size-10 rounded-full p-1">
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
                            <Link href="/login" className="flex items-center space-x-2 text-background hover:underline">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
