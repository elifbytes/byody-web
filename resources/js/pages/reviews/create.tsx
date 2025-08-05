import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { Order } from '@/types/order';
import { toast } from 'sonner';

interface CreateReviewPageProps {
    order: Order;
}

export default function CreateReviewPage({ order }: CreateReviewPageProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    const { data, setData, post, processing, errors } = useForm({
        order_id: order.id,
        customer_name: order.user?.name || '',
        rating: 0,
        comment: '',
    });

    const handleRatingChange = (newRating: number) => {
        setRating(newRating);
        setData('rating', newRating);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        post(route('reviews.store'), {
            onSuccess: () => {
                toast.success('Review submitted successfully!');
            },
            onError: () => {
                toast.error('Failed to submit review. Please try again.');
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Write Review" />
            <div className="mx-auto w-full max-w-2xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Write a Review</CardTitle>
                        <p className="text-sm text-gray-600">
                            Order #{order.reference} - {order.placed_at}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <Label htmlFor="customer_name">Your Name</Label>
                                <Input
                                    id="customer_name"
                                    value={data.customer_name}
                                    onChange={(e) => setData('customer_name', e.target.value)}
                                    required
                                />
                                {errors.customer_name && (
                                    <p className="text-sm text-red-600 mt-1">{errors.customer_name}</p>
                                )}
                            </div>

                            <div>
                                <Label>Rating</Label>
                                <div className="flex space-x-1 mt-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            className="focus:outline-none"
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            onClick={() => handleRatingChange(star)}
                                        >
                                            <Star
                                                className={`h-8 w-8 ${
                                                    star <= (hoverRating || rating)
                                                        ? 'fill-yellow-400 text-yellow-400'
                                                        : 'text-gray-300'
                                                }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                                {errors.rating && (
                                    <p className="text-sm text-red-600 mt-1">{errors.rating}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="comment">Your Review</Label>
                                <Textarea
                                    id="comment"
                                    value={data.comment}
                                    onChange={(e) => setData('comment', e.target.value)}
                                    placeholder="Share your experience with this order..."
                                    rows={4}
                                    required
                                />
                                {errors.comment && (
                                    <p className="text-sm text-red-600 mt-1">{errors.comment}</p>
                                )}
                            </div>

                            <Button type="submit" disabled={processing} className="w-full">
                                {processing ? 'Submitting...' : 'Submit Review'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}