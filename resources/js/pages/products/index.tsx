import SearchDialog from '@/components/search-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { flattenCollections } from '@/lib/collection';
import { Paginated } from '@/types';
import { Collection } from '@/types/collection';
import { Product } from '@/types/product';
import { SearchIcon } from 'lucide-react';
import { useState } from 'react';

const searchParams = new URLSearchParams();

interface ProductPageProps {
    products: Paginated<Product>;
    collections: Collection[];
}
export default function ProductPage({ products, collections }: ProductPageProps) {
    const flatCollections = flattenCollections(collections);
    const [openSearch, setOpenSearch] = useState<boolean>(false);

    // This component is for displaying a list of products.
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
                            <SearchDialog open={openSearch} onOpenChange={setOpenSearch} searchParams={searchParams} />
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Separator />
                        <div className="mt-4">
                            <h2 className="text-lg font-semibold">Collections</h2>
                            <ul className="mt-2 space-y-2">
                                {flatCollections.map((collection) => (
                                    <li key={collection.id} className="text-sm">
                                        <a href={`/collections/${collection.default_url?.slug}`} className="text-blue-600 hover:underline">
                                            {collection.attribute_data?.name.en}
                                        </a>
                                    </li>
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
                            <div key={product.id} className="overflow-hidden rounded-lg bg-white shadow">
                                <img
                                    src={product.thumbnail?.original_url}
                                    alt={product.attribute_data?.name.en}
                                    className="h-48 w-full object-cover"
                                />
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold">{product.attribute_data?.name.en}</h2>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
