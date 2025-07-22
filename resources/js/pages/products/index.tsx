import ProductCard from '@/components/product-card';
import ProductFilterForm from '@/components/product-filter-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from '@/components/ui/drawer';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { ScrollArea } from '@/components/ui/scroll-area';
import AppLayout from '@/layouts/app-layout';
import { getPaginationItems } from '@/lib/utils';
import { Paginated, UrlParams } from '@/types';
import { Collection } from '@/types/collection';
import { Product, ProductType } from '@/types/product';
import { router } from '@inertiajs/react';
import { ArrowDownUp, Settings2 } from 'lucide-react';

interface ProductPageProps {
    productTypes: ProductType[];
    products: Paginated<Product>;
    collections: Collection[];
    search?: string;
    filters?: Record<string, string>;
    sort?: string;
}
export default function ProductPage({ productTypes, products, collections, filters, sort }: ProductPageProps) {
    const currentPage = products.current_page;
    const lastPage = products.last_page;
    const perPage = products.per_page;
    const paginations = getPaginationItems(currentPage, lastPage, perPage);

    const urlParams: UrlParams = {
        filter: filters || {},
        sort: sort || '',
    };
    const handleSortChange = (value: string) =>
        router.get('/products', { ...urlParams, sort: value }, { preserveState: true, preserveScroll: true, replace: true });

    return (
        <AppLayout>
            <div className="container mx-auto grid gap-8 px-4 py-8 md:grid-cols-[1fr_3fr]">
                {/* Drawer on mobile */}
                <Drawer>
                    <DrawerTrigger className="md:hidden" asChild>
                        <Button variant="outline">
                            <Settings2 className="h-4 w-4" />
                            Filters
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Filters</DrawerTitle>
                            <DrawerDescription>Use the filters to narrow down your product search.</DrawerDescription>
                        </DrawerHeader>
                        <ScrollArea className="h-[calc(100vh-350px)] w-full p-4">
                            <ProductFilterForm productTypes={productTypes} collections={collections} filters={filters} sort={sort} />
                        </ScrollArea>
                        <DrawerFooter>
                            <DrawerClose asChild>
                                <Button>Close</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>

                {/* Card on Desktop */}
                <Card className="sticky top-36 hidden h-fit w-full max-w-xs md:block">
                    <CardHeader>
                        <CardDescription></CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ProductFilterForm productTypes={productTypes} collections={collections} filters={filters} sort={sort} />
                    </CardContent>
                </Card>
                <div>
                    <div className="mb-4 flex items-center justify-between">
                        <h1 className="text-2xl font-bold">Products</h1>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <ArrowDownUp className="h-4 w-4" />
                                    Sort By
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                                <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={sort} onValueChange={handleSortChange}>
                                    <DropdownMenuRadioItem value="date">Newest</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="-date">Oldest</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="price">Price: Low to High</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="-price">Price: High to Low</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="name">Name: A to Z</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="-name">Name: Z to A</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                        {products.data.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    <Pagination className="mt-10 flex items-center justify-end px-3">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href={products.prev_page_url || '#'}
                                    aria-disabled={currentPage <= 1}
                                    tabIndex={currentPage <= 1 ? -1 : undefined}
                                    className={currentPage <= 1 ? 'pointer-events-none opacity-50' : undefined}
                                />
                            </PaginationItem>
                            {paginations.map((pageNumber) =>
                                Number.isNaN(pageNumber) ? (
                                    <PaginationItem key={pageNumber}>
                                        <PaginationEllipsis />
                                    </PaginationItem>
                                ) : (
                                    <PaginationItem key={pageNumber}>
                                        <PaginationLink href={products.links[pageNumber].url || '#'} isActive={pageNumber === products.current_page}>
                                            {pageNumber}
                                        </PaginationLink>
                                    </PaginationItem>
                                ),
                            )}
                            <PaginationItem>
                                <PaginationNext
                                    href={products.next_page_url || '#'}
                                    aria-disabled={currentPage >= lastPage}
                                    tabIndex={currentPage >= lastPage ? -1 : undefined}
                                    className={currentPage >= lastPage ? 'pointer-events-none opacity-50' : undefined}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </AppLayout>
    );
}
