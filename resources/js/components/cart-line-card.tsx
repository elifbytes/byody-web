import { getProductVariantPrice } from '@/lib/price';
import { CartLine } from '@/types/cart';
import { Badge } from './ui/badge';

interface CartLineCardProps {
    line: CartLine;
}

function CartLineCard({ line }: CartLineCardProps) {
    const variantImage = line.purchasable?.images && line.purchasable.images.length > 0 ? line.purchasable.images[0].original_url : null;

    const productMedia =
        line.purchasable?.product?.media && line.purchasable.product.media.length > 0 ? line.purchasable.product.media[0].original_url : null;

    const thumbnailImage = line.purchasable?.product?.thumbnail?.original_url;
    
    const imageUrl = variantImage || productMedia || thumbnailImage;

    return (
        <div className="grid grid-cols-[1fr_3fr] gap-2">
            <div>
                {imageUrl && (
                    <img className="h-full w-full rounded object-cover" src={imageUrl} alt={line.purchasable?.product?.attribute_data?.name.en} />
                )}
            </div>
            <div className="flex flex-col justify-center space-y-2">
                <div className="line-clamp-2">{line.purchasable?.product?.attribute_data?.name.en}</div>
                <div className="flex gap-1">
                    {line.purchasable?.values?.map((value) => (
                        <Badge key={value.id} variant="outline" className="text-xs">
                            {value?.name.en}
                        </Badge>
                    ))}
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{`Quantity: ${line.quantity}`}</span>
                    <span className="text-sm font-medium">{getProductVariantPrice(line.purchasable)}</span>
                </div>
            </div>
        </div>
    );
}

export default CartLineCard;
