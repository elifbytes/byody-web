import CollectionsCarousel from '@/components/collections-carousel';
import ProductsCarousel from '@/components/products-carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import AppLayout from '@/layouts/app-layout';
import { Banner } from '@/types/banner';
import { Collection } from '@/types/collection';
import { Product } from '@/types/product';
import { Head } from '@inertiajs/react';
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
                {/* <CarouselContent className="-ml-1">
                    {banners.map((banner) => (
                        <CarouselItem key={banner.id} className="pl-1">
                            <AspectRatio ratio={16 / 9}>
                                <img src={banner.thumbnail?.original_url} alt={banner.title} className="h-full w-full object-cover" />
                            </AspectRatio>
                        </CarouselItem>
                    ))}
                </CarouselContent> */}
                <CarouselContent className="-ml-1">
                {[
                    {
                    id: 1,
                    title: 'Big Buck Bunny',
                    video: { original_url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
                    },
                ].map((banner) => (
                    <CarouselItem key={banner.id} className="pl-1">
                    <AspectRatio ratio={16 / 9}>
                        <video
                        key={banner.id}
                        src={banner.video?.original_url}
                        className="h-full w-full object-cover"
                        playsInline
                        autoPlay
                        muted
                        onEnded={(e) => {
                           const video = e.target as HTMLVideoElement;
                            video.currentTime = 0;
                            video.play();
                        }}
                        />
                    </AspectRatio>
                    </CarouselItem>
                ))}
                </CarouselContent>

            </Carousel>
            <h1 className="my-5 text-center text-3xl">NEW ARRIVALS</h1>
            <ProductsCarousel products={newArrivals} />
            <h1 className="my-5 text-center text-3xl">BEST SELLERS</h1>
            <ProductsCarousel products={bestSellers} />
            <h1 className="my-5 text-center text-3xl">SHOP BY CATEGORY</h1>
            <CollectionsCarousel collections={collections} />
        </AppLayout>
    );
}
