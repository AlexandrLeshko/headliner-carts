import { renderHook, waitFor } from '@testing-library/react';
import { useCarts } from './useCarts';
import { createWrapper } from '../test/createWrapper';

vi.mock('../api/client', () => ({
  getCarts: vi.fn(),
  getCartsByUser: vi.fn(),
}));

import { getCarts, getCartsByUser } from '../api/client';
const mockGetCarts = vi.mocked(getCarts);
const mockGetCartsByUser = vi.mocked(getCartsByUser);

const emptyResponse = { carts: [], total: 0, skip: 0, limit: 10 };

describe('useCarts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches all carts when userId is null', async () => {
    mockGetCarts.mockResolvedValue(emptyResponse);

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useCarts(10, 0, null), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockGetCarts).toHaveBeenCalledWith(10, 0, expect.any(AbortSignal));
    expect(mockGetCartsByUser).not.toHaveBeenCalled();
  });

  it('fetches carts by user when userId is provided', async () => {
    mockGetCartsByUser.mockResolvedValue(emptyResponse);

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useCarts(10, 0, 5), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockGetCartsByUser).toHaveBeenCalledWith(5, 10, 0, expect.any(AbortSignal));
    expect(mockGetCarts).not.toHaveBeenCalled();
  });

  it('returns fetched data', async () => {
    const data = { carts: [{ id: 1 }], total: 1, skip: 0, limit: 10 };
    mockGetCarts.mockResolvedValue(data as never);

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useCarts(10, 0), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(data);
  });

  it('returns error when fetch fails', async () => {
    mockGetCarts.mockRejectedValue(new Error('fail'));

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useCarts(10, 0), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
