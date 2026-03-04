import axios from 'axios';
import type { Cart, CartsListResponse, UpdateCartPayload } from './types';

const api = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCarts = async (limit: number, skip: number): Promise<CartsListResponse> => {
  const { data } = await api.get<CartsListResponse>('/carts', { params: { limit, skip } });
  return data;
};

export const getCartsByUser = async (
  userId: number,
  limit: number,
  skip: number
): Promise<CartsListResponse> => {
  try {
    const { data } = await api.get<CartsListResponse>(`/carts/user/${userId}`, {
      params: { limit, skip },
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return { carts: [], total: 0, skip, limit };
    }
    throw error;
  }
};

export const getCart = async (id: number): Promise<Cart> => {
  const { data } = await api.get<Cart>(`/carts/${id}`);
  return data;
};

export const updateCart = async (id: number, payload: UpdateCartPayload): Promise<Cart> => {
  const { data } = await api.put<Cart>(`/carts/${id}`, payload);
  return data;
};
