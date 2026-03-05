import { memo, useState } from 'react';
import { Button, Input, Label } from '@components/ui';
import {
  ProductCard,
  ThumbnailWrap,
  Thumbnail,
  ThumbnailFallback,
  ProductContent,
  QuantityForm,
  QuantityLabel,
  ButtonRow,
} from './CartDetail.styles';
import type { CartProduct } from '@api/types';
import { Check, ImageOff, X } from 'lucide-react';

type ProductCardItemProps = {
  product: CartProduct;
  isPending: boolean;
  onQuantitySubmit: (productId: number, e: React.FormEvent<HTMLFormElement>) => void;
  onRemove: (productId: number) => void;
};

export const ProductCardItem = memo(function ProductCardItem({
  product,
  isPending,
  onQuantitySubmit,
  onRemove,
}: ProductCardItemProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <ProductCard aria-label={product.title}>
      <ThumbnailWrap>
        {product.thumbnail && !imgError ? (
          <Thumbnail
            src={product.thumbnail}
            alt={`Photo of ${product.title}`}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <ThumbnailFallback aria-label="Image unavailable">
            <ImageOff size={48} />
          </ThumbnailFallback>
        )}
      </ThumbnailWrap>
      <ProductContent>
        <p><Label>Title:</Label> {product.title}</p>
        <p><Label>Price:</Label> ${(product.price ?? 0).toFixed(2)}</p>
        <p><Label>Total:</Label> ${(product.total ?? 0).toFixed(2)}</p>
        <p><Label>Discounted total:</Label> ${(product.discountedTotal ?? 0).toFixed(2)}</p>
        {(product.discountPercentage ?? 0) > 0 && (
          <p><Label>Discount:</Label> {(product.discountPercentage ?? 0).toFixed(1)}%</p>
        )}
        <QuantityForm
          onSubmit={(e) => onQuantitySubmit(product.id, e)}
          aria-label={`Update quantity for ${product.title}`}
        >
          <QuantityLabel>
            <Label>Quantity</Label>
            <Input
              type="number"
              name="quantity"
              defaultValue={product.quantity}
              min="0"
              aria-label={`Quantity for ${product.title}`}
            />
          </QuantityLabel>
          <ButtonRow>
            <Button type="submit" disabled={isPending} aria-label={`Confirm quantity for ${product.title}`}>
              <Check size={24} />
              <span>Update</span>
            </Button>
            <Button
              type="button"
              variant="danger"
              disabled={isPending}
              onClick={() => onRemove(product.id)}
              aria-label={`Remove ${product.title} from cart`}
            >
              <X size={24} />
              <span>Remove</span>
            </Button>
          </ButtonRow>
        </QuantityForm>
      </ProductContent>
    </ProductCard>
  );
});
