import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useUpdateCart } from '../../hooks/useUpdateCart';
import { ArrowLeft, CircleAlert, RotateCw } from 'lucide-react';
import { Button } from '@components/ui/Button';
import { Label } from '@components/ui/Label';
import { StatusState } from '@components/ui/StatusState';
import { ProductCardItem } from './ProductCardItem';
import {
  Section,
  CartSummary,
  ProductList,
} from './CartDetail.styles';

export const CartDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const cartId = id ? Number(id) : undefined;
  const { data, isLoading, isError, error, refetch } = useCart(cartId);
  const updateCart = useUpdateCart(
    cartId !== undefined && !Number.isNaN(cartId) ? cartId : null
  );

  const handleUpdateQuantity = useCallback(
    (productId: number, quantity: number) => {
      if (!data?.products) return;
      if (quantity > 0) {
        updateCart.mutate({ merge: true, products: [{ id: productId, quantity }] });
      } else {
        const rest = data.products
          .filter((p) => p.id !== productId)
          .map((p) => ({ id: p.id, quantity: p.quantity }));
        updateCart.mutate({ merge: false, products: rest });
      }
    },
    [data, updateCart]
  );

  const handleRemove = useCallback(
    (productId: number) => {
      if (!data?.products) return;
      const rest = data.products
        .filter((p) => p.id !== productId)
        .map((p) => ({ id: p.id, quantity: p.quantity }));
      updateCart.mutate({ merge: false, products: rest });
    },
    [data, updateCart]
  );

  const handleQuantitySubmit = useCallback(
    (productId: number, e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const qty = Number(formData.get('quantity') ?? 0);
      handleUpdateQuantity(productId, qty);
    },
    [handleUpdateQuantity]
  );

  if (isLoading) {
    return <StatusState title="Loading..." />;
  }

  if (isError) {
    return (
      <StatusState
        icon={<CircleAlert size={50} />}
        title="Error"
        description={error instanceof Error ? error.message : String(error)}
        action={
          <Button type="button" onClick={() => refetch()}>
            <RotateCw size={24} />
            <span>Retry</span>
          </Button>
        }
      />
    );
  }

  if (cartId === undefined || Number.isNaN(cartId) || !data) {
    return (
      <StatusState
        icon={<CircleAlert size={50} />}
        title="Cart not found"
        action={
          <Button type="button" onClick={() => navigate('/')}>
            <ArrowLeft size={24} />
            <span>Back to list</span>
          </Button>
        }
      />
    );
  }

  return (
    <Section>
      <div>
        <Button type="button" onClick={() => navigate('/')}>
          <ArrowLeft size={24} />
          <span>Back to list</span>
        </Button>
      </div>

      {updateCart.isError && (
        <StatusState
          icon={<CircleAlert size={50} />}
          title="Update failed"
          description={String(updateCart.error)}
          action={
            <Button
              type="button"
              onClick={() => updateCart.variables && updateCart.mutate(updateCart.variables)}
            >
              <RotateCw size={24} />
              <span>Retry</span>
            </Button>
          }
        />
      )}

      <CartSummary>
        <p><Label>Cart ID:</Label> {data.id}</p>
        <p><Label>User ID:</Label> {data.userId}</p>
        <p><Label>Total:</Label> ${(data.total ?? 0).toFixed(2)}</p>
        {data.total !== data.discountedTotal && (
          <p><Label>Discounted total:</Label> ${(data.discountedTotal ?? 0).toFixed(2)}</p>
        )}
      </CartSummary>

      <ProductList>
        {data.products?.map((product) => (
          <li key={product.id}>
            <ProductCardItem
              key={`${product.id}-${product.quantity}`}
              product={product}
              isPending={updateCart.isPending}
              onQuantitySubmit={handleQuantitySubmit}
              onRemove={handleRemove}
            />
          </li>
        ))}
      </ProductList>
    </Section>
  );
};
