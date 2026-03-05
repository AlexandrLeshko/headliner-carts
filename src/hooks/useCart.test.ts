import { renderHook, waitFor } from '@testing-library/react';
import { useCart } from './useCart';
import { createWrapper } from '../test/createWrapper';

vi.mock('../api/client', () => ({
  getCart: vi.fn(),
}));

import { getCart } from '../api/client';
const mockGetCart = vi.mocked(getCart);

describe('useCart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches cart when id is valid', async () => {
    const mockCart = { id: 1, products: [], total: 100, discountedTotal: 90, userId: 1, totalProducts: 0, totalQuantity: 0 };
    mockGetCart.mockResolvedValue(mockCart);

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useCart(1), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockCart);
    expect(mockGetCart).toHaveBeenCalledWith(1, expect.any(AbortSignal));
  });

  it('does not fetch when id is undefined', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useCart(undefined), { wrapper });
    expect(result.current.fetchStatus).toBe('idle');
    expect(mockGetCart).not.toHaveBeenCalled();
  });

  it('does not fetch when id is NaN', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useCart(NaN), { wrapper });
    expect(result.current.fetchStatus).toBe('idle');
    expect(mockGetCart).not.toHaveBeenCalled();
  });

  it('returns error when fetch fails', async () => {
    mockGetCart.mockRejectedValue(new Error('Network error'));

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useCart(99), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
  });
});
