import { create } from 'zustand';
import type { PaginationState } from './types';

export const usePaginationStore = create<PaginationState>((set, get) => ({
  page: 1,
  limit: 10,
  userIdFilter: null,
  setPage: (page) => set({ page }),
  setLimit: (limit) =>
    set((state) => ({
      limit,
      page: state.limit !== limit ? 1 : state.page,
    })),
  setUserIdFilter: (userIdFilter) =>
    set((state) => ({
      userIdFilter,
      page: state.userIdFilter !== userIdFilter ? 1 : state.page,
    })),
  getSkip: () => (get().page - 1) * get().limit,
}));
