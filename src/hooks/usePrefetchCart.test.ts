import { renderHook, act } from '@testing-library/react';
import { usePrefetchCart } from './usePrefetchCart';
import { createWrapper } from '../test/createWrapper';

vi.mock('../api/client', () => ({
  getCart: vi.fn().mockResolvedValue({ id: 1, products: [], total: 0, discountedTotal: 0, userId: 1, totalProducts: 0, totalQuantity: 0 }),
}));

import { getCart } from '../api/client';
const mockGetCart = vi.mocked(getCart);

describe('usePrefetchCart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns a function', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => usePrefetchCart(), { wrapper });
    expect(typeof result.current).toBe('function');
  });

  it('calls prefetchQuery which triggers getCart', async () => {
    const { wrapper, qc } = createWrapper();
    const prefetchSpy = vi.spyOn(qc, 'prefetchQuery');

    const { result } = renderHook(() => usePrefetchCart(), { wrapper });

    await act(async () => {
      result.current(42);
    });

    expect(prefetchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['carts', 'detail', 42],
      }),
    );
    expect(mockGetCart).toHaveBeenCalled();

    prefetchSpy.mockRestore();
  });

  it('populates the query cache after prefetch', async () => {
    const mockCart = { id: 7, products: [], total: 0, discountedTotal: 0, userId: 1, totalProducts: 0, totalQuantity: 0 };
    mockGetCart.mockResolvedValue(mockCart);

    const { wrapper, qc } = createWrapper();
    const { result } = renderHook(() => usePrefetchCart(), { wrapper });

    await act(async () => {
      result.current(7);
    });

    const cached = qc.getQueryData(['carts', 'detail', 7]);
    expect(cached).toEqual(mockCart);
  });
});
