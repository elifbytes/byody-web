import { AppContent } from '@/components/app-content';
import AppFooter from '@/components/app-footer';
import { AppHeader } from '@/components/app-header';
import CollectionsCarousel from '@/components/collections-carousel';
import ProductsCarousel from '@/components/products-carousel';
import { Banner } from '@/types/banner';
import { Collection } from '@/types/collection';
import { Product } from '@/types/product';
import { Head } from '@inertiajs/react';

interface HomeProps {
    banners: Banner[];
    newArrivals: Product[];
    collections: Collection[];
    bestSellers: Product[];
}

export default function Home({ collections, newArrivals, bestSellers }: HomeProps) {
    return (
        <>
            <AppHeader position="fixed" />
            <AppContent>
                <Head title="Home">
                    <link rel="preconnect" href="https://fonts.bunny.net" />
                    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
                </Head>

                {/* Video */}
                <video src="https://www.w3schools.com/html/mov_bbb.mp4" className="z-40 h-full w-full object-cover" playsInline autoPlay muted loop />

                <h1 className="my-5 text-center text-3xl">NEW ARRIVALS</h1>
                <ProductsCarousel products={newArrivals} />
                <h1 className="my-5 text-center text-3xl">BEST SELLERS</h1>
                <ProductsCarousel products={bestSellers} />
                <h1 className="my-5 text-center text-3xl">SHOP BY CATEGORY</h1>
                <CollectionsCarousel collections={collections} />
            </AppContent>
            <AppFooter />
        </>
    );
}
