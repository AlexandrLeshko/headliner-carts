import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCart } from '@api/client';
import { cartKeys } from '@api/queryKeys';
import type { Cart, UpdateCartPayload } from '@api/types';

export const useUpdateCart = (cartId: number | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCartPayload) => {
      if (cartId === null) {
        return Promise.reject(new Error('No cart selected'));
      }
      return updateCart(cartId, payload);
    },
    onMutate: async (payload) => {
      if (cartId === null) return;

      await queryClient.cancelQueries({ queryKey: cartKeys.detail(cartId) });

      const previous = queryClient.getQueryData<Cart>(cartKeys.detail(cartId));

      if (previous) {
        const optimistic = applyOptimisticUpdate(previous, payload);
        queryClient.setQueryData(cartKeys.detail(cartId), optimistic);
      }

      return { previous };
    },
    onError: (_error, _payload, context) => {
      if (cartId !== null && context?.previous) {
        queryClient.setQueryData(cartKeys.detail(cartId), context.previous);
      }
    },
    onSettled: () => {
      if (cartId !== null) {
        queryClient.invalidateQueries({ queryKey: cartKeys.lists() });
      }
    },
  });
};

function applyOptimisticUpdate(cart: Cart, payload: UpdateCartPayload): Cart {
  if (payload.merge) {
    const updatedProducts = cart.products.map((p) => {
      const update = payload.products.find((u) => u.id === p.id);
      if (!update) return p;
      const quantity = update.quantity;
      const total = p.price * quantity;
      return { ...p, quantity, total, discountedTotal: total * (1 - p.discountPercentage / 100) };
    });
    return recalcCart(cart, updatedProducts);
  }

  const updatedProducts = payload.products
    .map((u) => {
      const existing = cart.products.find((p) => p.id === u.id);
      if (!existing) return null;
      const total = existing.price * u.quantity;
      return { ...existing, quantity: u.quantity, total, discountedTotal: total * (1 - existing.discountPercentage / 100) };
    })
    .filter((p): p is NonNullable<typeof p> => p !== null);

  return recalcCart(cart, updatedProducts);
}

function recalcCart(cart: Cart, products: Cart['products']): Cart {
  const total = products.reduce((sum, p) => sum + p.total, 0);
  const discountedTotal = products.reduce((sum, p) => sum + p.discountedTotal, 0);
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);

  return {
    ...cart,
    products,
    total,
    discountedTotal,
    totalProducts: products.length,
    totalQuantity,
  };
}
