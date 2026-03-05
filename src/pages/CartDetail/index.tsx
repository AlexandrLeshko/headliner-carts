import { useNavigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart } from '@hooks/useCart';
import { useCartActions } from '@hooks/useCartActions';
import { ArrowLeft, CircleAlert, RotateCw, ShoppingCart } from 'lucide-react';
import { Button, Label, StatusState } from '@components/ui';
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
  const cartActions = useCartActions(
    cartId !== undefined && !Number.isNaN(cartId) ? cartId : null,
    data?.products,
  );

  if (isLoading) {
    return (
      <>
        <Helmet><title>Loading cart...</title></Helmet>
        <StatusState
          title="Loading..."
          aria-live="polite"
          aria-busy
        />
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Helmet><title>Error — Cart</title></Helmet>
        <StatusState
          icon={<CircleAlert size={24} />}
          title="Error"
          description={error instanceof Error ? error.message : String(error)}
          action={
            <Button type="button" onClick={() => refetch()} aria-label="Retry loading cart">
              <RotateCw size={24} />
              <span>Retry</span>
            </Button>
          }
        />
      </>
    );
  }

  if (cartId === undefined || Number.isNaN(cartId) || !data) {
    return (
      <>
        <Helmet><title>Cart not found</title></Helmet>
        <StatusState
          icon={<CircleAlert size={24} />}
          title="Cart not found"
          action={
            <Button type="button" onClick={() => navigate('/')}>
              <ArrowLeft size={24} />
              <span>Back to list</span>
            </Button>
          }
        />
      </>
    );
  }

  return (
    <Section aria-label={`Cart ${data.id} details`}>
      <Helmet>
        <title>{`Cart #${data.id} — ${data.totalProducts} items`}</title>
      </Helmet>

      <div>
        <Button type="button" onClick={() => navigate('/')} aria-label="Back to cart list">
          <ArrowLeft size={24} />
          <span>Back to list</span>
        </Button>
      </div>

      <CartSummary aria-label="Cart summary">
        <h1>Cart #{data.id}</h1>
        <p><Label>User ID:</Label> {data.userId}</p>
        <p><Label>Total:</Label> ${(data.total ?? 0).toFixed(2)}</p>
        {data.total !== data.discountedTotal && (
          <p><Label>Discounted total:</Label> ${(data.discountedTotal ?? 0).toFixed(2)}</p>
        )}
      </CartSummary>

      {cartActions.isError && (
        <StatusState
          icon={<CircleAlert size={24} />}
          title="Update failed"
          description={String(cartActions.error)}
          action={
            <Button
              type="button"
              onClick={() => cartActions.variables && cartActions.mutate(cartActions.variables)}
              aria-label="Retry failed update"
            >
              <RotateCw size={24} />
              <span>Retry</span>
            </Button>
          }
        />
      )}

      {data.products?.length ? (
        <ProductList aria-label="Products in cart">
          {data.products.map((product) => (
            <li key={product.id}>
              <ProductCardItem
                key={`${product.id}-${product.quantity}`}
                product={product}
                isPending={cartActions.isPending}
                onQuantitySubmit={cartActions.handleQuantitySubmit}
                onRemove={cartActions.removeProduct}
              />
            </li>
          ))}
        </ProductList>
      ) : (
        <StatusState
          icon={<ShoppingCart size={24} />}
          title="Cart is empty"
          description="All products have been removed"
          action={
            <Button type="button" onClick={() => navigate('/')}>
              <ArrowLeft size={24} />
              <span>Back to list</span>
            </Button>
          }
        />
      )}
    </Section>
  );
};
