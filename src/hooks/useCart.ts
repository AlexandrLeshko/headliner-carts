import { useQuery } from '@tanstack/react-query';
import { getCart } from '../api/client';
import { cartKeys } from '../api/queryKeys';

export const useCart = (id: number | undefined) =>
  useQuery({
    queryKey: cartKeys.detail(id ?? 0),
    queryFn: () => {
      if (id === undefined || Number.isNaN(id)) {
        throw new Error('Invalid cart id');
      }
      return getCart(id);
    },
    enabled: id !== undefined && !Number.isNaN(id),
  });
