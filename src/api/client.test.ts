import axios from 'axios';
import { getCarts, getCartsByUser, getCart, updateCart } from './client';

vi.mock('axios', () => {
  const mockInstance = {
    get: vi.fn(),
    put: vi.fn(),
  };
  return {
    default: {
      create: vi.fn(() => mockInstance),
      isAxiosError: vi.fn(),
    },
    __mockInstance: mockInstance,
  };
});

const getMockInstance = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (axios as any).create() as {
    get: ReturnType<typeof vi.fn>;
    put: ReturnType<typeof vi.fn>;
  };
};

describe('API client', () => {
  let api: ReturnType<typeof getMockInstance>;

  beforeEach(() => {
    api = getMockInstance();
    vi.clearAllMocks();
  });

  describe('getCarts', () => {
    it('calls GET /carts with params and signal', async () => {
      const mockData = { carts: [], total: 0, skip: 0, limit: 10 };
      api.get.mockResolvedValue({ data: mockData });
      const controller = new AbortController();

      const result = await getCarts(10, 0, controller.signal);

      expect(api.get).toHaveBeenCalledWith('/carts', {
        params: { limit: 10, skip: 0 },
        signal: controller.signal,
      });
      expect(result).toEqual(mockData);
    });
  });

  describe('getCartsByUser', () => {
    it('calls GET /carts/user/:userId with params', async () => {
      const mockData = { carts: [], total: 0, skip: 0, limit: 10 };
      api.get.mockResolvedValue({ data: mockData });

      const result = await getCartsByUser(5, 10, 0);
      expect(api.get).toHaveBeenCalledWith('/carts/user/5', {
        params: { limit: 10, skip: 0 },
        signal: undefined,
      });
      expect(result).toEqual(mockData);
    });

    it('returns empty result on 404', async () => {
      const error = { response: { status: 404 } };
      api.get.mockRejectedValue(error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (axios.isAxiosError as any).mockReturnValue(true);

      const result = await getCartsByUser(999, 10, 0);
      expect(result).toEqual({ carts: [], total: 0, skip: 0, limit: 10 });
    });

    it('rethrows non-404 errors', async () => {
      const error = { response: { status: 500 } };
      api.get.mockRejectedValue(error);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (axios.isAxiosError as any).mockReturnValue(true);

      await expect(getCartsByUser(5, 10, 0)).rejects.toBe(error);
    });
  });

  describe('getCart', () => {
    it('calls GET /carts/:id with signal', async () => {
      const mockCart = { id: 1, products: [], total: 0, discountedTotal: 0, userId: 1, totalProducts: 0, totalQuantity: 0 };
      api.get.mockResolvedValue({ data: mockCart });
      const controller = new AbortController();

      const result = await getCart(1, controller.signal);
      expect(api.get).toHaveBeenCalledWith('/carts/1', { signal: controller.signal });
      expect(result).toEqual(mockCart);
    });
  });

  describe('updateCart', () => {
    it('calls PUT /carts/:id with payload', async () => {
      const payload = { merge: true, products: [{ id: 1, quantity: 3 }] };
      const mockCart = { id: 1, products: [], total: 30, discountedTotal: 25, userId: 1, totalProducts: 0, totalQuantity: 3 };
      api.put.mockResolvedValue({ data: mockCart });

      const result = await updateCart(1, payload);
      expect(api.put).toHaveBeenCalledWith('/carts/1', payload);
      expect(result).toEqual(mockCart);
    });
  });
});
