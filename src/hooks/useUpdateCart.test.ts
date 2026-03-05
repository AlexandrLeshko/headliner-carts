import { renderHook, waitFor, act } from '@testing-library/react';
import { useUpdateCart } from './useUpdateCart';
import { createWrapper } from '../test/createWrapper';

vi.mock('../api/client', () => ({
  updateCart: vi.fn(),
}));

import { updateCart } from '../api/client';
const mockUpdateCart = vi.mocked(updateCart);

describe('useUpdateCart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls updateCart with cartId and payload', async () => {
    const mockCart = { id: 1, products: [], total: 50, discountedTotal: 45, userId: 1, totalProducts: 0, totalQuantity: 0 };
    mockUpdateCart.mockResolvedValue(mockCart);
    const { wrapper } = createWrapper({ mutations: { retry: false } });

    const { result } = renderHook(() => useUpdateCart(1), { wrapper });

    act(() => {
      result.current.mutate({ merge: true, products: [{ id: 10, quantity: 3 }] });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockUpdateCart).toHaveBeenCalledWith(1, { merge: true, products: [{ id: 10, quantity: 3 }] });
  });

  it('rejects when cartId is null', async () => {
    const { wrapper } = createWrapper({ mutations: { retry: false } });

    const { result } = renderHook(() => useUpdateCart(null), { wrapper });

    act(() => {
      result.current.mutate({ merge: true, products: [{ id: 1, quantity: 1 }] });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('No cart selected');
    expect(mockUpdateCart).not.toHaveBeenCalled();
  });

  it('keeps optimistic data in cache after success', async () => {
    const existingCart = {
      id: 1,
      products: [
        { id: 10, title: 'Item', price: 20, quantity: 1, total: 20, discountPercentage: 0, discountedTotal: 20, thumbnail: '' },
      ],
      total: 20,
      discountedTotal: 20,
      userId: 1,
      totalProducts: 1,
      totalQuantity: 1,
    };
    mockUpdateCart.mockResolvedValue({ ...existingCart, products: [{ ...existingCart.products[0], quantity: 3, total: 60, discountedTotal: 60 }] });
    const { wrapper, qc } = createWrapper({ mutations: { retry: false } });
    qc.setQueryData(['carts', 'detail', 1], existingCart);

    const { result } = renderHook(() => useUpdateCart(1), { wrapper });

    act(() => {
      result.current.mutate({ merge: true, products: [{ id: 10, quantity: 3 }] });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const cached = qc.getQueryData<typeof existingCart>(['carts', 'detail', 1]);
    expect(cached?.products[0].quantity).toBe(3);
    expect(cached?.products[0].title).toBe('Item');
  });

  it('applies optimistic update before server responds', async () => {
    const existingCart = {
      id: 1,
      products: [
        { id: 10, title: 'Item', price: 20, quantity: 1, total: 20, discountPercentage: 0, discountedTotal: 20, thumbnail: '' },
      ],
      total: 20,
      discountedTotal: 20,
      userId: 1,
      totalProducts: 1,
      totalQuantity: 1,
    };
    const serverCart = { ...existingCart, products: [{ ...existingCart.products[0], quantity: 5, total: 100, discountedTotal: 100 }], total: 100, discountedTotal: 100, totalQuantity: 5 };

    let resolveUpdate!: (value: typeof serverCart) => void;
    mockUpdateCart.mockImplementation(() => new Promise((r) => { resolveUpdate = r; }));

    const { wrapper, qc } = createWrapper({ mutations: { retry: false } });
    qc.setQueryData(['carts', 'detail', 1], existingCart);

    const { result } = renderHook(() => useUpdateCart(1), { wrapper });

    act(() => {
      result.current.mutate({ merge: true, products: [{ id: 10, quantity: 5 }] });
    });

    await waitFor(() => {
      const cached = qc.getQueryData<typeof existingCart>(['carts', 'detail', 1]);
      expect(cached?.products[0].quantity).toBe(5);
    });

    await act(async () => { resolveUpdate(serverCart); });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('rolls back on error', async () => {
    const existingCart = {
      id: 1,
      products: [
        { id: 10, title: 'Item', price: 20, quantity: 1, total: 20, discountPercentage: 0, discountedTotal: 20, thumbnail: '' },
      ],
      total: 20,
      discountedTotal: 20,
      userId: 1,
      totalProducts: 1,
      totalQuantity: 1,
    };

    mockUpdateCart.mockRejectedValue(new Error('Server error'));

    const { wrapper, qc } = createWrapper({ mutations: { retry: false } });
    qc.setQueryData(['carts', 'detail', 1], existingCart);

    const { result } = renderHook(() => useUpdateCart(1), { wrapper });

    act(() => {
      result.current.mutate({ merge: true, products: [{ id: 10, quantity: 99 }] });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    const cached = qc.getQueryData<typeof existingCart>(['carts', 'detail', 1]);
    expect(cached?.products[0].quantity).toBe(1);
  });
});
