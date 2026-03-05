import { useCallback } from 'react';
import { useUpdateCart } from '@hooks/useUpdateCart';
import type { CartProduct, UpdateCartPayload } from '@api/types';

export const buildUpdatePayload = (
  products: CartProduct[],
  productId: number,
  quantity: number,
): UpdateCartPayload => {
  if (quantity > 0) {
    return { merge: true, products: [{ id: productId, quantity }] };
  }
  return {
    merge: false,
    products: products
      .filter((p) => p.id !== productId)
      .map((p) => ({ id: p.id, quantity: p.quantity })),
  };
};

export const buildRemovePayload = (
  products: CartProduct[],
  productId: number,
): UpdateCartPayload => ({
  merge: false,
  products: products
    .filter((p) => p.id !== productId)
    .map((p) => ({ id: p.id, quantity: p.quantity })),
});

export const useCartActions = (
  cartId: number | null,
  products?: CartProduct[],
) => {
  const mutation = useUpdateCart(cartId);
  const { mutate } = mutation;

  const updateQuantity = useCallback(
    (productId: number, quantity: number) => {
      if (!products) return;
      mutate(buildUpdatePayload(products, productId, quantity));
    },
    [products, mutate],
  );

  const removeProduct = useCallback(
    (productId: number) => {
      if (!products) return;
      mutate(buildRemovePayload(products, productId));
    },
    [products, mutate],
  );

  const handleQuantitySubmit = useCallback(
    (productId: number, e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const qty = Number(formData.get('quantity') ?? 0);
      updateQuantity(productId, qty);
    },
    [updateQuantity],
  );

  return {
    ...mutation,
    updateQuantity,
    removeProduct,
    handleQuantitySubmit,
  };
};
