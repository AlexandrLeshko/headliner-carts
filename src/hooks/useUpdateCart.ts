import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCart } from '../api/client';
import { cartKeys } from '../api/queryKeys';
import type { UpdateCartPayload } from '../api/types';

export const useUpdateCart = (cartId: number | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCartPayload) => {
      if (cartId === null) {
        return Promise.reject(new Error('No cart selected'));
      }
      return updateCart(cartId, payload);
    },
    onSuccess: (data) => {
      if (cartId !== null) {
        queryClient.setQueryData(cartKeys.detail(cartId), data);
        queryClient.invalidateQueries({
          queryKey: cartKeys.all,
          predicate: (query) => cartKeys.isListKey(query.queryKey as unknown[]),
        });
      }
    },
  });
};
