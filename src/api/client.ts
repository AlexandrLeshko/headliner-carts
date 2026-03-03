import axios from 'axios';
import type { Cart, CartsListResponse, UpdateCartPayload } from './types';

const api = axios.create({
  baseURL: 'https://dummyjson.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchCarts = async (limit: number, skip: number): Promise<CartsListResponse> => {
  const { data } = await api.get<CartsListResponse>('/carts', { params: { limit, skip } });
  return data;
};

export const fetchCart = async (id: number): Promise<Cart> => {
  const { data } = await api.get<Cart>(`/carts/${id}`);
  return data;
};

export const updateCart = async (id: number, payload: UpdateCartPayload): Promise<Cart> => {
  const { data } = await api.put<Cart>(`/carts/${id}`, payload);
  return data;
};
