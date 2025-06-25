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
    bestSellers: Product[];
}

export default function Home({ banners, collections, newArrivals, bestSellers }: HomeProps) {
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
            <h1 className="text-center text-2xl font-semibold">NEW ARRIVALS</h1>
            <Carousel className="mx-auto max-w-screen md:max-w-3xl lg:max-w-4xl xl:max-w-7xl">
                <CarouselContent>
                    {newArrivals.map((product) => (
                        <CarouselItem key={product.id} className="basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                            <Link href={product.default_url ? route('product.show', product.default_url.slug) : '#'}>
                                <div className="hover:bg-gray-100">
                                    <AspectRatio ratio={1 / 1}>
                                        <img
                                            src={product.thumbnail?.original_url}
                                            alt={product.attribute_data?.name.en}
                                            className="h-full w-full rounded-sm object-cover"
                                        />
                                    </AspectRatio>
                                    <div className="flex h-20 flex-col justify-between px-2 py-1">
                                        <p className="line-clamp-2">{product.attribute_data?.name.en}</p>
                                        <p className="text-sm font-semibold">${product.price}</p>
                                    </div>
                                </div>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
            </Carousel>
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
                    <CarouselPrevious className="absolute left-4 z-10" />
                    <CarouselNext className="absolute right-4 z-10" />
                </Carousel>
            </div>
            <h1 className="text-center text-2xl font-semibold">BEST SELLERS</h1>
            <Carousel className="mx-auto max-w-screen md:max-w-3xl lg:max-w-4xl xl:max-w-7xl">
                <CarouselContent>
                    {bestSellers.map((product) => (
                        <CarouselItem key={product.id} className="basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                            <Link href={product.default_url ? route('product.show', product.default_url.slug) : '#'}>
                                <div className="hover:bg-gray-100">
                                    <AspectRatio ratio={1 / 1}>
                                        <img
                                            src={product.thumbnail?.original_url}
                                            alt={product.attribute_data?.name.en}
                                            className="h-full w-full rounded-sm object-cover"
                                        />
                                    </AspectRatio>
                                    <div className="flex h-20 flex-col justify-between px-2 py-1">
                                        <p className="line-clamp-2">{product.attribute_data?.name.en}</p>
                                        <p className="text-sm font-semibold">${product.price}</p>
                                    </div>
                                </div>
                            </Link>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex" />
                <CarouselNext className="hidden md:flex" />
            </Carousel>
        </AppLayout>
    );
}
