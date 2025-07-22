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
            <div className="mb-6 overflow-x-auto">
                <div className="flex flex-row gap-3 min-w-max">
                    {[
                        { name: "John Doe", stars: 4, comment: "Produk sangat bagus dan pengiriman cepat!", date: "2024-06-01" },
                        { name: "Siti Aminah", stars: 5, comment: "Sangat puas dengan kualitasnya, recommended!", date: "2024-06-02" },
                        { name: "Budi Santoso", stars: 3, comment: "Cukup baik, tapi pengiriman agak lama.", date: "2024-06-03" },
                        { name: "Agus Wijaya", stars: 5, comment: "Luar biasa, sesuai dengan deskripsi.", date: "2024-06-04" },
                        { name: "Maria Ulfa", stars: 2, comment: "Kurang memuaskan, produk tidak sesuai harapan.", date: "2024-06-05" },
                        { name: "ahmad wijaya", stars: 4, comment: "mantap, produk sesuai harga.", date: "2024-06-05" }
                    ].map((rating, idx) => (
                        <div key={idx} className="w-64 min-w-[16rem] max-w-xs rounded-lg border p-3 shadow bg-white flex-shrink-0">
                            <div className="flex items-center mb-1">
                                <span className="font-semibold mr-2 text-sm">{rating.name}</span>
                                <span className="flex text-yellow-400">
                                    {[1,2,3,4,5].map((star) => (
                                        <svg key={star} xmlns="http://www.w3.org/2000/svg" fill={star <= rating.stars ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.286 7.037a1 1 0 00.95.69h7.396c.969 0 1.371 1.24.588 1.81l-5.99 4.356a1 1 0 00-.364 1.118l2.286 7.037c.3.921-.755 1.688-1.54 1.118l-5.99-4.356a1 1 0 00-1.176 0l-5.99 4.356c-.784.57-1.838-.197-1.54-1.118l2.286-7.037a1 1 0 00-.364-1.118L2.12 12.464c-.783-.57-.38-1.81.588-1.81h7.396a1 1 0 00.95-.69l2.286-7.037z" />
                                        </svg>
                                    ))}
                                </span>
                            </div>
                            <div className="text-gray-700 text-xs mb-1">{rating.comment}</div>
                            <div className="text-xs text-gray-400">{rating.date}</div>
                        </div>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
