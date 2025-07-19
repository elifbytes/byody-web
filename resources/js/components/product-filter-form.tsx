import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { flattenCollections } from '@/lib/collection';
import { UrlParams } from '@/types';
import { Collection } from '@/types/collection';
import { ProductType } from '@/types/product';
import { router } from '@inertiajs/react';
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';
import SearchDialog from './search-dialog';
import { Button } from './ui/button';

interface ProductFilterFormProps {
    productTypes: ProductType[];
    collections: Collection[];
    filters?: Record<string, string>;
    sort?: string;
}

const MAX_SLIDER_VALUE = 500; // Maximum value for the price slider

export default function ProductFilterForm({ productTypes, collections, filters, sort }: ProductFilterFormProps) {
    const [openSearch, setOpenSearch] = useState<boolean>(false);
    const urlParams: UrlParams = {
        filter: filters || {},
        sort: sort || '',
    };
    const flatCollections = flattenCollections(collections);
    // filters comma separated values to array
    // for collections
    let filteredCollections: string[] = [];
    if (filters?.collections) {
        filteredCollections = filters.collections.split(',');
    }
    // for product types
    let filteredProductTypes: string[] = [];
    if (filters?.product_types) {
        filteredProductTypes = filters.product_types.split(',');
    }

    const [priceSliderValue, setPriceSliderValue] = useState([Number(filters?.min_price || 0), Number(filters?.max_price || MAX_SLIDER_VALUE)]);

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
        <>
            <Button variant="outline" className="mb-4 flex w-full justify-start" onClick={() => setOpenSearch(true)}>
                <SearchIcon className="h-4 w-4" />
                Search
            </Button>
            <SearchDialog open={openSearch} onOpenChange={setOpenSearch} urlParams={urlParams} />
            <div>
                <h2 className="text-lg font-semibold">Product Types</h2>
                <ul className="mt-2 space-y-2">
                    {productTypes.map((type) => (
                        <div className="flex items-center gap-3" key={type.id}>
                            <Checkbox
                                id={`type-${type.id}`}
                                className="flex items-center space-x-2 rounded-full"
                                checked={filteredProductTypes.includes(type.id.toString())}
                                onCheckedChange={(checked) =>
                                    handleFilterChange([
                                        {
                                            filter: 'product_types',
                                            value: checked
                                                ? [...filteredProductTypes, type.id.toString()].join(',')
                                                : filteredProductTypes.filter((t) => t !== type.id.toString()).join(','),
                                        },
                                    ])
                                }
                            />
                            <Label htmlFor={`type-${type.id}`}>{type.name}</Label>
                        </div>
                    ))}
                </ul>
            </div>
            <div className="mt-6">
                <h2 className="text-lg font-semibold">Collections</h2>
                <ul className="mt-2 space-y-2">
                    {flatCollections.map((collection) => (
                        <div className="flex items-center gap-3" key={collection.id}>
                            <Checkbox
                                id={collection.default_url?.slug}
                                className="flex items-center space-x-2 rounded-full"
                                checked={collection.default_url?.slug ? filteredCollections.includes(collection.default_url?.slug) : false}
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
        </>
    );
}
