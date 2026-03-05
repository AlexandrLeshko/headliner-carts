import { buildUpdatePayload, buildRemovePayload } from './useCartActions';
import type { CartProduct } from '@api/types';

const mockProducts: CartProduct[] = [
  {
    id: 1, title: 'Product A', price: 10, quantity: 2,
    total: 20, discountPercentage: 0, discountedTotal: 20, thumbnail: '',
  },
  {
    id: 2, title: 'Product B', price: 20, quantity: 3,
    total: 60, discountPercentage: 10, discountedTotal: 54, thumbnail: '',
  },
  {
    id: 3, title: 'Product C', price: 5, quantity: 1,
    total: 5, discountPercentage: 0, discountedTotal: 5, thumbnail: '',
  },
];

describe('buildUpdatePayload', () => {
  it('returns merge:true when quantity > 0', () => {
    const result = buildUpdatePayload(mockProducts, 1, 5);
    expect(result).toEqual({
      merge: true,
      products: [{ id: 1, quantity: 5 }],
    });
  });

  it('returns merge:false with remaining products when quantity is 0', () => {
    const result = buildUpdatePayload(mockProducts, 2, 0);
    expect(result).toEqual({
      merge: false,
      products: [
        { id: 1, quantity: 2 },
        { id: 3, quantity: 1 },
      ],
    });
  });

  it('returns merge:false with remaining products when quantity is negative', () => {
    const result = buildUpdatePayload(mockProducts, 1, -1);
    expect(result).toEqual({
      merge: false,
      products: [
        { id: 2, quantity: 3 },
        { id: 3, quantity: 1 },
      ],
    });
  });

  it('returns empty products array when removing the last product', () => {
    const singleProduct = [mockProducts[0]];
    const result = buildUpdatePayload(singleProduct, 1, 0);
    expect(result).toEqual({ merge: false, products: [] });
  });
});

describe('buildRemovePayload', () => {
  it('removes the specified product', () => {
    const result = buildRemovePayload(mockProducts, 2);
    expect(result).toEqual({
      merge: false,
      products: [
        { id: 1, quantity: 2 },
        { id: 3, quantity: 1 },
      ],
    });
  });

  it('returns empty products when removing the only product', () => {
    const singleProduct = [mockProducts[0]];
    const result = buildRemovePayload(singleProduct, 1);
    expect(result).toEqual({ merge: false, products: [] });
  });

  it('keeps all products when id does not match', () => {
    const result = buildRemovePayload(mockProducts, 999);
    expect(result).toEqual({
      merge: false,
      products: [
        { id: 1, quantity: 2 },
        { id: 2, quantity: 3 },
        { id: 3, quantity: 1 },
      ],
    });
  });
});
