import { memo } from 'react';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Label } from '@components/ui/Label';
import {
  ProductCard,
  ThumbnailWrap,
  Thumbnail,
  ProductContent,
  QuantityForm,
  QuantityLabel,
  ButtonRow,
} from './CartDetail.styles';
import type { CartProduct } from '../../api/types';
import { Check, X } from 'lucide-react';

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
  return (
    <ProductCard>
      <ThumbnailWrap>
        {product.thumbnail && (
          <Thumbnail src={product.thumbnail} alt={product.title} />
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
        <QuantityForm onSubmit={(e) => onQuantitySubmit(product.id, e)}>
          <QuantityLabel>
            <Label>Quantity</Label>
            <Input
              type="number"
              name="quantity"
              defaultValue={product.quantity}
              min="0"
            />
          </QuantityLabel>
          <ButtonRow>
            <Button type="submit" disabled={isPending}>
              <Check size={24} />
              <span>Update</span>
            </Button>
            <Button
              type="button"
              variant="danger"
              disabled={isPending}
              onClick={() => onRemove(product.id)}
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
