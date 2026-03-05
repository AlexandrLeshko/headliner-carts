import { z } from 'zod';

export const CartProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  quantity: z.number(),
  total: z.number().default(0),
  discountPercentage: z.number().default(0),
  discountedTotal: z.number().default(0),
  thumbnail: z.string().default(''),
});

export const CartSchema = z.object({
  id: z.number(),
  products: z.array(CartProductSchema),
  total: z.number().default(0),
  discountedTotal: z.number().default(0),
  userId: z.number(),
  totalProducts: z.number().default(0),
  totalQuantity: z.number().default(0),
});

export const CartsListResponseSchema = z.object({
  carts: z.array(CartSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});
