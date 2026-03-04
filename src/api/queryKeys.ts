export const cartKeys = {
  all: ['carts'] as const,
  lists: () => [...cartKeys.all, 'list'] as const,
  list: (limit: number, skip: number, userId?: number | null) =>
    (userId != null
      ? (['carts', 'user', userId, limit, skip] as const)
      : ([...cartKeys.all, limit, skip] as const)),
  detail: (id: number) => [...cartKeys.all, id] as const,
  isListKey: (key: unknown[]): boolean =>
    (key[0] === 'carts' &&
      key.length === 3 &&
      typeof key[1] === 'number' &&
      typeof key[2] === 'number') ||
    (key[0] === 'carts' &&
      key.length === 5 &&
      key[1] === 'user' &&
      typeof key[2] === 'number' &&
      typeof key[3] === 'number' &&
      typeof key[4] === 'number'),
};
