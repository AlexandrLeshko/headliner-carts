import type { z } from 'zod';
import type {
  CartProductSchema,
  CartSchema,
  CartsListResponseSchema,
} from './schemas';

export type CartProduct = z.infer<typeof CartProductSchema>;
export type Cart = z.infer<typeof CartSchema>;
export type CartsListResponse = z.infer<typeof CartsListResponseSchema>;

export interface UpdateCartPayload {
  merge: boolean;
  products: Array<{ id: number; quantity: number }>;
}
