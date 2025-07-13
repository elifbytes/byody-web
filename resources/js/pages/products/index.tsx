import ProductCard from '@/components/product-card';
import SearchDialog from '@/components/search-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import AppLayout from '@/layouts/app-layout';
import { flattenCollections } from '@/lib/collection';
import { getPaginationItems } from '@/lib/utils';
import { Paginated, UrlParams } from '@/types';
import { Collection } from '@/types/collection';
import { Product } from '@/types/product';
import { router } from '@inertiajs/react';
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';

const MAX_SLIDER_VALUE = 500; // Maximum value for the price slider

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
    const [priceSliderValue, setPriceSliderValue] = useState([Number(filters?.min_price || 0), Number(filters?.max_price || MAX_SLIDER_VALUE)]);

    const currentPage = products.current_page;
    const lastPage = products.last_page;
    const perPage = products.per_page;
    const paginations = getPaginationItems(currentPage, lastPage, perPage);

    // const handleSortChange = (value: string) => {
    //     setData('sort', value);
    // };

    const handleFilterChange = (values: { filter: string; value: string }[]) => {
        const newFilters: Record<string, string> = { ...urlParams.filter };
        values.forEach(({ filter, value }) => {
            if (value === '') {
                delete newFilters[filter];
            } else {
                newFilters[filter] = value;
            }
        });
        router.get('/products', { ...urlParams, filter: newFilters }, { preserveState: true, preserveScroll: true, replace: true });
    };

    return (
        <AppLayout>
            <div className="container mx-auto grid grid-cols-[1fr_3fr] gap-8 px-4 py-8">
                <Card className='sticky top-36 h-fit w-full max-w-xs'>
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
                        <div>
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
                                                handleFilterChange([
                                                    {
                                                        filter: 'collections',
                                                        value: checked
                                                            ? [...filteredCollections, collection.default_url?.slug].join(',')
                                                            : filteredCollections.filter((c) => c !== collection.default_url?.slug).join(','),
                                                    },
                                                ])
                                            }
                                        />
                                        <Label htmlFor={collection.default_url?.slug}>{collection.attribute_data?.name.en}</Label>
                                    </div>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h2 className="mt-6 mb-2 text-lg font-semibold">Availability</h2>
                            <RadioGroup
                                defaultValue={filters?.availability || 'all'}
                                onValueChange={(value) => handleFilterChange([{ filter: 'availability', value }])}
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="all" id="all" />
                                    <Label htmlFor="all">All</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="in-stock" id="in-stock" />
                                    <Label htmlFor="in-stock">In Stock</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="mt-6">
                            <h2 className="mb-2 text-lg font-semibold">Price Range</h2>
                            <Slider
                                defaultValue={priceSliderValue}
                                min={0}
                                max={MAX_SLIDER_VALUE}
                                step={5}
                                onValueCommit={(value) => {
                                    handleFilterChange([
                                        { filter: 'min_price', value: value[0].toString() },
                                        { filter: 'max_price', value: value[1].toString() },
                                    ]);
                                }}
                                onValueChange={(value) => setPriceSliderValue(value)}
                            />
                            <div className="mt-2 flex items-center justify-between space-x-4">
                                <div className="flex items-center space-x-1">
                                    <Label className="text-xs">Min</Label>
                                    <Input
                                        type="number"
                                        value={priceSliderValue[0]}
                                        onChange={(e) => handleFilterChange([{ filter: 'min_price', value: e.target.value }])}
                                        className="w-24"
                                        placeholder="Min Price"
                                    />
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Label className="text-xs">Max</Label>
                                    <Input
                                        type="number"
                                        value={priceSliderValue[1]}
                                        onChange={(e) => handleFilterChange([{ filter: 'max_price', value: e.target.value }])}
                                        className="w-24"
                                        placeholder="Max Price"
                                    />
                                </div>
                            </div>
                        </div>
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
