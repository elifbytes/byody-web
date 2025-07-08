import { useDebounce } from '@/hooks/use-debounce';
import searchService from '@/services/search-service';
import { Product } from '@/types/product';
import { Link, router } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';

interface SearchDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    searchParams?: URLSearchParams;
}
export default function SearchDialog({ open, onOpenChange, searchParams }: SearchDialogProps) {
    const [searchProducts, setSearchProducts] = useState<Product[]>([]);

    const [search, setSearch] = useState<string>('');
    const debouncedsearch = useDebounce<string>(search, 500);

    const handleSearch = useCallback(
        (query: string) => {
            console.log('handleSearch', query);

            router.get(
                '/products',
                {
                    search: query,
                    ...Object.fromEntries(searchParams || []), // Include any additional search params
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                },
            );
            onOpenChange(false);
        },
        [onOpenChange, searchParams],
    );

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

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onOpenChange(false);
            }
            if (e.key === 'Enter') {
                handleSearch(search);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, [handleSearch, onOpenChange, search]);

    return (
        <CommandDialog open={open} onOpenChange={onOpenChange} shouldFilter={false}>
            <CommandInput placeholder="Search our products..." value={search} onValueChange={setSearch} />
            <CommandList>
                {searchProducts.length <= 0 ? (
                    <CommandEmpty>No products found.</CommandEmpty>
                ) : (
                    <CommandGroup heading="Results">
                        {searchProducts.map((product) => (
                            <Link key={product.id} href={route('products.show', product.default_url?.slug)}>
                                <CommandItem
                                    onSelect={() => {
                                        onOpenChange(false);
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
    );
}
