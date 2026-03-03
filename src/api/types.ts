export interface CartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
}

export interface Cart {
  id: number;
  products: CartProduct[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

export interface CartsListResponse {
  carts: Cart[];
  total: number;
  skip: number;
  limit: number;
}

export interface UpdateCartPayload {
  merge: boolean;
  products: Array<{ id: number; quantity: number }>;
}
