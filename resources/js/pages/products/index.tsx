import ProductCard from '@/components/product-card';
import SearchDialog from '@/components/search-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { flattenCollections } from '@/lib/collection';
import { getPaginationItems } from '@/lib/utils';
import { Paginated, UrlParams } from '@/types';
import { Collection } from '@/types/collection';
import { Product } from '@/types/product';
import { router } from '@inertiajs/react';
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';

interface ProductPageProps {
    products: Paginated<Product>;
    collections: Collection[];
    search?: string;
    filters?: Record<string, string>;
    sort?: string;
}
export default function ProductPage({ products, collections, filters, sort }: ProductPageProps) {
    const urlParams: UrlParams = {
        filter: filters || {},
        sort: sort || '',
    };
    const flatCollections = flattenCollections(collections);
    // filters comma separated values to array
    let filteredCollections: string[] = [];
    if (filters?.collections) {
        filteredCollections = filters.collections.split(',');
    }
    const [openSearch, setOpenSearch] = useState<boolean>(false);

    const currentPage = products.current_page;
    const lastPage = products.last_page;
    const perPage = products.per_page;
    const paginations = getPaginationItems(currentPage, lastPage, perPage);

    // const handleSortChange = (value: string) => {
    //     setData('sort', value);
    // };

    const handleFilterChange = (key: string, value: string) => {
        const newFilters = { ...urlParams.filter, [key]: value };
        if (value === '') {
            delete newFilters[key];
        }
        router.get(
            '/products',
            { ...urlParams, filter: newFilters },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    return (
        <AppLayout>
            <div className="container mx-auto grid grid-cols-[1fr_3fr] gap-8 px-4 py-8">
                <Card>
                    <CardHeader>
                        <CardDescription>
                            <Button variant="outline" className="flex w-full justify-start" onClick={() => setOpenSearch(true)}>
                                <SearchIcon className="h-4 w-4" />
                                Search
                            </Button>
                            <SearchDialog open={openSearch} onOpenChange={setOpenSearch} urlParams={urlParams} />
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Separator />
                        <div className="mt-4">
                            <h2 className="text-lg font-semibold">Collections</h2>
                            <ul className="mt-2 space-y-2">
                                {flatCollections.map((collection) => (
                                    <div className="flex items-center gap-3" key={collection.id}>
                                        <Checkbox
                                            id={collection.default_url?.slug}
                                            className="flex items-center space-x-2"
                                            checked={
                                                collection.default_url?.slug ? filteredCollections.includes(collection.default_url?.slug) : false
                                            }
                                            onCheckedChange={(checked) =>
                                                handleFilterChange(
                                                    'collections',
                                                    checked
                                                        ? [...filteredCollections, collection.default_url?.slug].join(',')
                                                        : filteredCollections.filter((c) => c !== collection.default_url?.slug).join(','),
                                                )
                                            }
                                        />
                                        <Label htmlFor={collection.default_url?.slug}>{collection.attribute_data?.name.en}</Label>
                                    </div>
                                ))}
                            </ul>
                        </div>
                        <Separator className="my-4" />
                    </CardContent>
                </Card>
                <div>
                    <h1 className="mb-6 text-2xl font-bold">Products</h1>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
