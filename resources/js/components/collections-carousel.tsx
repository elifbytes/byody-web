import { flattenCollections } from '@/lib/collection';
import { Collection } from '@/types/collection';
import { AspectRatio } from './ui/aspect-ratio';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';

interface CollectionsCarouselProps {
    collections: Collection[];
}

function CollectionsCarousel({ collections }: CollectionsCarouselProps) {
    const flatCollections = flattenCollections(collections);
    return (
        <Carousel className="mx-2 my-5">
            <CarouselContent>
                {flatCollections.map((collection) => (
                    <CarouselItem key={collection.id} className="relative basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
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
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-4 z-10" />
            <CarouselNext className="absolute right-4 z-10" />
        </Carousel>
    );
}

export default CollectionsCarousel;
