import { useQuery } from '@tanstack/react-query';
import { getCarts, getCartsByUser } from '../api/client';
import { cartKeys } from '../api/queryKeys';

export const useCarts = (
  limit: number,
  skip: number,
  userId: number | null = null
) =>
  useQuery({
    queryKey: cartKeys.list(limit, skip, userId),
    queryFn: () =>
      userId != null
        ? getCartsByUser(userId, limit, skip)
        : getCarts(limit, skip),
  });
