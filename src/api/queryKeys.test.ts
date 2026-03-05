import { cartKeys } from './queryKeys';

describe('cartKeys', () => {
  describe('all', () => {
    it('returns the root key', () => {
      expect(cartKeys.all).toEqual(['carts']);
    });
  });

  describe('lists', () => {
    it('returns the list prefix key', () => {
      expect(cartKeys.lists()).toEqual(['carts', 'list']);
    });

    it('starts with the all key', () => {
      expect(cartKeys.lists().slice(0, 1)).toEqual(cartKeys.all);
    });
  });

  describe('list', () => {
    it('builds key with limit and skip', () => {
      const key = cartKeys.list({ limit: 10, skip: 0 });
      expect(key).toEqual(['carts', 'list', { limit: 10, skip: 0 }]);
    });

    it('builds key with userId', () => {
      const key = cartKeys.list({ limit: 10, skip: 0, userId: 5 });
      expect(key).toEqual(['carts', 'list', { limit: 10, skip: 0, userId: 5 }]);
    });

    it('builds key with null userId', () => {
      const key = cartKeys.list({ limit: 10, skip: 0, userId: null });
      expect(key).toEqual(['carts', 'list', { limit: 10, skip: 0, userId: null }]);
    });

    it('starts with the lists prefix', () => {
      const key = cartKeys.list({ limit: 10, skip: 20 });
      expect(key.slice(0, 2)).toEqual(cartKeys.lists());
    });
  });

  describe('details', () => {
    it('returns the detail prefix key', () => {
      expect(cartKeys.details()).toEqual(['carts', 'detail']);
    });
  });

  describe('detail', () => {
    it('builds key with id', () => {
      expect(cartKeys.detail(42)).toEqual(['carts', 'detail', 42]);
    });

    it('starts with the details prefix', () => {
      expect(cartKeys.detail(1).slice(0, 2)).toEqual(cartKeys.details());
    });
  });

  describe('hierarchy', () => {
    it('all keys share the same root', () => {
      const root = cartKeys.all[0];
      expect(cartKeys.lists()[0]).toBe(root);
      expect(cartKeys.list({ limit: 10, skip: 0 })[0]).toBe(root);
      expect(cartKeys.details()[0]).toBe(root);
      expect(cartKeys.detail(1)[0]).toBe(root);
    });

    it('list keys do not match detail prefix', () => {
      const listKey = cartKeys.list({ limit: 10, skip: 0 });
      const detailPrefix = cartKeys.details();
      expect(listKey[1]).not.toBe(detailPrefix[1]);
    });
  });
});
