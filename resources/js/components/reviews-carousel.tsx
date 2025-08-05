import { formatDate } from '@/lib/utils';
import { Review } from '@/types/review';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';

interface ReviewsCarouselProps {
    reviews: Review[];
}

function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
    if (!reviews || reviews.length === 0) {
        return <div className="text-center text-gray-500">No reviews available</div>;
    }

    return (
        <Carousel className="mx-auto w-screen md:max-w-3xl lg:max-w-4xl xl:max-w-7xl">
            <CarouselContent>
                {reviews.map((review, idx) => (
                    <CarouselItem key={idx} className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                        <div className="w-full flex-shrink-0 rounded-lg border bg-white p-3 shadow">
                            <div className="mb-1 flex items-center">
                                <span className="mr-2 text-sm font-semibold">{review.customer_name}</span>
                                <span className="flex text-yellow-400">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <svg
                                            key={star}
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill={star <= review.rating ? 'currentColor' : 'none'}
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            className="h-4 w-4"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.286 7.037a1 1 0 00.95.69h7.396c.969 0 1.371 1.24.588 1.81l-5.99 4.356a1 1 0 00-.364 1.118l2.286 7.037c.3.921-.755 1.688-1.54 1.118l-5.99-4.356a1 1 0 00-1.176 0l-5.99 4.356c-.784.57-1.838-.197-1.54-1.118l2.286-7.037a1 1 0 00-.364-1.118L2.12 12.464c-.783-.57-.38-1.81.588-1.81h7.396a1 1 0 00.95-.69l2.286-7.037z"
                                            />
                                        </svg>
                                    ))}
                                </span>
                            </div>
                            <div className="mb-1 text-xs text-gray-700">{review.comment}</div>
                            <div className="text-xs text-gray-400">{formatDate(review.created_at)}</div>
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
        </Carousel>
    );
}

export default ReviewsCarousel;
