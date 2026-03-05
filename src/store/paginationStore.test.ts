import { usePaginationStore, selectSkip } from './paginationStore';

describe('paginationStore', () => {
  beforeEach(() => {
    usePaginationStore.setState({ page: 1, limit: 12, userIdFilter: null });
  });

  describe('initial state', () => {
    it('has correct defaults', () => {
      const state = usePaginationStore.getState();
      expect(state.page).toBe(1);
      expect(state.limit).toBe(12);
      expect(state.userIdFilter).toBeNull();
    });
  });

  describe('setPage', () => {
    it('updates the page', () => {
      usePaginationStore.getState().setPage(3);
      expect(usePaginationStore.getState().page).toBe(3);
    });
  });

  describe('setLimit', () => {
    it('updates the limit and resets page when limit changes', () => {
      usePaginationStore.getState().setPage(5);
      usePaginationStore.getState().setLimit(20);
      const state = usePaginationStore.getState();
      expect(state.limit).toBe(20);
      expect(state.page).toBe(1);
    });

    it('does not reset page when limit is the same', () => {
      usePaginationStore.getState().setPage(5);
      usePaginationStore.getState().setLimit(12);
      expect(usePaginationStore.getState().page).toBe(5);
    });
  });

  describe('setUserIdFilter', () => {
    it('updates filter and resets page when filter changes', () => {
      usePaginationStore.getState().setPage(3);
      usePaginationStore.getState().setUserIdFilter(42);
      const state = usePaginationStore.getState();
      expect(state.userIdFilter).toBe(42);
      expect(state.page).toBe(1);
    });

    it('does not reset page when filter is the same', () => {
      usePaginationStore.getState().setUserIdFilter(42);
      usePaginationStore.getState().setPage(3);
      usePaginationStore.getState().setUserIdFilter(42);
      expect(usePaginationStore.getState().page).toBe(3);
    });

    it('resets filter to null', () => {
      usePaginationStore.getState().setUserIdFilter(42);
      usePaginationStore.getState().setUserIdFilter(null);
      expect(usePaginationStore.getState().userIdFilter).toBeNull();
    });
  });

  describe('selectSkip', () => {
    it('computes skip from page and limit', () => {
      const state = { page: 1, limit: 10 } as Parameters<typeof selectSkip>[0];
      expect(selectSkip(state)).toBe(0);
    });

    it('computes skip for page 3 with limit 20', () => {
      const state = { page: 3, limit: 20 } as Parameters<typeof selectSkip>[0];
      expect(selectSkip(state)).toBe(40);
    });

    it('works with store state', () => {
      usePaginationStore.getState().setLimit(5);
      usePaginationStore.getState().setPage(4);
      expect(selectSkip(usePaginationStore.getState())).toBe(15);
    });
  });
});
