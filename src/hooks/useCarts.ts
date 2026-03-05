import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getCarts, getCartsByUser } from '@api/client';
import { cartKeys } from '@api/queryKeys';

export const useCarts = (
  limit: number,
  skip: number,
  userId: number | null = null,
) =>
  useQuery({
    queryKey: cartKeys.list({ limit, skip, userId }),
    queryFn: ({ signal }) =>
      userId != null
        ? getCartsByUser(userId, limit, skip, signal)
        : getCarts(limit, skip, signal),
    placeholderData: keepPreviousData,
  });
