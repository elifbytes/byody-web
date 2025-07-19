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
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import AppLayout from '@/layouts/app-layout';
import { getPaginationItems } from '@/lib/utils';
import { Paginated } from '@/types';
import { Collection } from '@/types/collection';
import { Product } from '@/types/product';
import { Filter } from 'lucide-react';

interface ProductPageProps {
    products: Paginated<Product>;
    collections: Collection[];
    search?: string;
    filters?: Record<string, string>;
    sort?: string;
}
export default function ProductPage({ products, collections, filters, sort }: ProductPageProps) {
    const currentPage = products.current_page;
    const lastPage = products.last_page;
    const perPage = products.per_page;
    const paginations = getPaginationItems(currentPage, lastPage, perPage);

    return (
        <AppLayout>
            <div className="container mx-auto grid gap-8 px-4 py-8 md:grid-cols-[1fr_3fr]">
                {/* Drawer on mobile */}
                <Drawer>
                    <DrawerTrigger className="md:hidden" asChild>
                        <Button variant="outline">
                            <Filter className="h-4 w-4" />
                            Filters
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Filters</DrawerTitle>
                            <DrawerDescription>Use the filters to narrow down your product search.</DrawerDescription>
                        </DrawerHeader>
                        <div className="p-6">
                            <ProductFilterForm collections={collections} filters={filters} sort={sort} />
                        </div>
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
                        <ProductFilterForm collections={collections} filters={filters} sort={sort} />
                    </CardContent>
                </Card>
                <div>
                    <h1 className="mb-6 text-2xl font-bold">Products</h1>
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
