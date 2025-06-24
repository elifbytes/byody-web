import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import AppLayout from '@/layouts/app-layout';
import { Banner } from '@/types/banner';
import { Collection } from '@/types/collection';
import { Product } from '@/types/product';
import { Head, Link } from '@inertiajs/react';
import Autoplay from 'embla-carousel-autoplay';

interface HomeProps {
    banners: Banner[];
    newArrivals: Product[];
    collections: Collection[];
}

export default function Home({ banners, collections, newArrivals }: HomeProps) {
    return (
        <AppLayout>
            <Head title="Home">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <Carousel
                opts={{
                    loop: true,
                }}
                plugins={[
                    Autoplay({
                        delay: 5000,
                    }),
                ]}
            >
                <CarouselContent className="-ml-1">
                    {banners.map((banner) => (
                        <CarouselItem key={banner.id} className="pl-1">
                            <AspectRatio ratio={16 / 9}>
                                <img src={banner.thumbnail?.original_url} alt={banner.title} className="h-full w-full object-cover" />
                            </AspectRatio>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            <div className="grid gap-10">
                <div>
                    <h1 className="text-center text-2xl font-semibold">NEW ARRIVALS</h1>
                    <Carousel className="mx-24 my-5">
                        <CarouselContent>
                            {newArrivals.map((product) => (
                                <CarouselItem key={product.id} className="relative basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                                    <Link
                                        className="hover:bg-gray-100"
                                        href={product.default_url ? route('product.show', product.default_url.slug) : '#'}
                                    >
                                        <AspectRatio ratio={1 / 1}>
                                            <img
                                                src={product.thumbnail?.original_url}
                                                alt={product.attribute_data?.name.en}
                                                className="h-full w-full rounded-sm object-cover"
                                            />
                                        </AspectRatio>
                                        <div className="px-2 py-1">
                                            <p className="line-clamp-2">{product.attribute_data?.name.en}</p>
                                            <p className="text-sm">{product.prices?.length ? product.price : '-'}</p>
                                        </div>
                                    </Link>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
                <div>
                    <h1 className="text-center text-2xl font-semibold">SHOP BY CATEGORY</h1>
                    <Carousel className="mx-2 my-5">
                        <CarouselContent>
                            {collections.map((collection) => (
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
                        <CarouselPrevious className="absolute left-4 z-50" />
                        <CarouselNext className="absolute right-4 z-50" />
                    </Carousel>
                </div>
            </div>
        </AppLayout>
    );
}
