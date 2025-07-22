import { flattenCollections } from '@/lib/collection';
import { Collection } from '@/types/collection';
import { Link } from '@inertiajs/react';
import { AspectRatio } from './ui/aspect-ratio';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';

interface CollectionsCarouselProps {
    collections: Collection[];
}

function CollectionsCarousel({ collections }: CollectionsCarouselProps) {
    const flatCollections = flattenCollections(collections);
    return (
        <Carousel className="mx-auto w-screen md:max-w-3xl lg:max-w-4xl xl:max-w-7xl">
            <CarouselContent>
                {flatCollections.map((collection) => (
                    <CarouselItem key={collection.id} className="relative basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                        <Link href={`/products?filter[collections]=${collection.default_url?.slug}`} className="relative">
                            <AspectRatio ratio={3 / 4}>
                                <img
                                    src={collection.thumbnail?.original_url}
                                    alt={collection.attribute_data?.name.en}
                                    className="h-full w-full object-cover"
                                />
                            </AspectRatio>
                            <div className="absolute inset-0 flex items-center justify-center text-white">
                                <h3 className="text-lg font-semibold">{collection.attribute_data?.name.en}</h3>
                            </div>
                        </Link>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
        </Carousel>
    );
}

export default CollectionsCarousel;
