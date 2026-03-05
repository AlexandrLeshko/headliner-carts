import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { getCart } from '@api/client';
import { cartKeys } from '@api/queryKeys';
import { DEFAULT_STALE_TIME } from '@api/constants';

export const usePrefetchCart = () => {
  const queryClient = useQueryClient();

  return useCallback(
    (cartId: number) => {
      queryClient.prefetchQuery({
        queryKey: cartKeys.detail(cartId),
        queryFn: ({ signal }) => getCart(cartId, signal),
        staleTime: DEFAULT_STALE_TIME,
      });
    },
    [queryClient],
  );
};
