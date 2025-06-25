import { Breadcrumbs } from '@/components/breadcrumbs';
import { Icon } from '@/components/icon';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
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
import { useDebounce } from '@/hooks/use-debounce';
import { useInitials } from '@/hooks/use-initials';
import { cn } from '@/lib/utils';
import searchService from '@/services/search-service';
import { type BreadcrumbItem, type NavItem, type SharedData } from '@/types';
import { Product } from '@/types/product';
import { Link, usePage } from '@inertiajs/react';
import { Menu, Search } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import AppLogo from './app-logo';
import AppLogoIcon from './app-logo-icon';
import Cart from './cart';

const mainNavItems: NavItem[] = [
    {
        title: 'Home',
        href: '/',
    },
    {
        title: 'Sale',
        href: '/collections/sale',
    },
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
    const [searchProducts, setSearchProducts] = useState<Product[]>([]);

    const [search, setSearch] = useState<string>('');
    const debouncedsearch = useDebounce<string>(search, 500);

    const getInitials = useInitials();

    const getSearchProducts = useCallback(async () => {
        const searchResult = await searchService.getProducts(debouncedsearch);
        setSearchProducts(searchResult);
    }, [debouncedsearch]);

    useEffect(() => {
        if (debouncedsearch.trim() === '') {
            setSearchProducts([]);
            return;
        }
        getSearchProducts();
    }, [debouncedsearch, getSearchProducts]);

    return (
        <>
            <div className="border-b border-sidebar-border/80 sticky top-0 z-50 bg-background">
                <div className="flex justify-center bg-primary p-3 text-background">HOLA BEFRIENDS! BOOST YOUR CONFIDENCE US</div>
                <div className="flex h-16 items-center justify-between px-4">
                    <div className="flex items-center">
                        {/* Mobile Menu */}
                        <div className="lg:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="mr-2 h-[34px] w-[34px]">
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

                        <Link href="/" prefetch className="flex items-center space-x-2">
                            <AppLogo />
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="ml-6 hidden h-full items-center space-x-6 lg:flex">
                        <NavigationMenu className="flex h-full items-stretch">
                            <NavigationMenuList className="flex h-full items-stretch space-x-2">
                                {mainNavItems.map((item, index) => (
                                    <NavigationMenuItem key={index} className="relative flex h-full items-center">
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                navigationMenuTriggerStyle(),
                                                page.url === item.href && activeItemStyles,
                                                'h-9 cursor-pointer px-3',
                                            )}
                                        >
                                            {item.icon && <Icon iconNode={item.icon} className="mr-2 h-4 w-4" />}
                                            {item.title}
                                        </Link>
                                    </NavigationMenuItem>
                                ))}
                                <NavigationMenuItem className="relative flex h-full items-center">
                                    <NavigationMenuTrigger>Shop</NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[300px] gap-4">
                                            <li>
                                                {collections.map((collection) => (
                                                    <NavigationMenuLink key={collection.id} asChild>
                                                        <Link href={`/collections/${collection.default_url?.slug}`}>
                                                            <div className="font-medium">{collection.attribute_data?.name.en}</div>
                                                        </Link>
                                                    </NavigationMenuLink>
                                                ))}
                                            </li>
                                        </ul>
                                    </NavigationMenuContent>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="icon" className="group h-9 w-9 cursor-pointer" onClick={() => setOpenSearch(true)}>
                            <Search className="!size-5 opacity-80 group-hover:opacity-100" />
                        </Button>
                        <CommandDialog open={openSearch} onOpenChange={setOpenSearch} shouldFilter={false}>
                            <CommandInput placeholder="Search our products..." value={search} onValueChange={setSearch} />
                            <CommandList>
                                {searchProducts.length <= 0 ? (
                                    <CommandEmpty>No products found.</CommandEmpty>
                                ) : (
                                    <CommandGroup heading="Results">
                                        {searchProducts.map((product) => (
                                            <Link key={product.id} href={route('product.show', product.default_url?.slug)}>
                                                <CommandItem
                                                    onSelect={() => {
                                                        setOpenSearch(false);
                                                    }}
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        {product.thumbnail && (
                                                            <img
                                                                src={product.thumbnail.original_url}
                                                                alt={product.attribute_data?.name.en}
                                                                className="h-6 w-6 rounded"
                                                            />
                                                        )}
                                                        <span>{product.attribute_data?.name.en}</span>
                                                    </div>
                                                </CommandItem>
                                            </Link>
                                        ))}
                                    </CommandGroup>
                                )}
                            </CommandList>
                        </CommandDialog>
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
                            <Link href="/login" className="flex items-center space-x-2">
                                <Button variant="outline" size="sm">
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
