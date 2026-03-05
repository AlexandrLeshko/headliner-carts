import axios from 'axios';
import { CartSchema, CartsListResponseSchema } from './schemas';
import type { Cart, CartsListResponse, UpdateCartPayload } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCarts = async (
  limit: number,
  skip: number,
  signal?: AbortSignal,
): Promise<CartsListResponse> => {
  const { data } = await api.get('/carts', {
    params: { limit, skip },
    signal,
  });
  return CartsListResponseSchema.parse(data);
};

export const getCartsByUser = async (
  userId: number,
  limit: number,
  skip: number,
  signal?: AbortSignal,
): Promise<CartsListResponse> => {
  try {
    const { data } = await api.get(`/carts/user/${userId}`, {
      params: { limit, skip },
      signal,
    });
    return CartsListResponseSchema.parse(data);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return { carts: [], total: 0, skip, limit };
    }
    throw error;
  }
};

export const getCart = async (id: number, signal?: AbortSignal): Promise<Cart> => {
  const { data } = await api.get(`/carts/${id}`, { signal });
  return CartSchema.parse(data);
};

export const updateCart = async (id: number, payload: UpdateCartPayload): Promise<Cart> => {
  const { data } = await api.put(`/carts/${id}`, payload);
  return CartSchema.parse(data);
};
