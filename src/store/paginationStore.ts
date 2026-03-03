import { create } from 'zustand';
import type { PaginationState } from './types';

export const usePaginationStore = create<PaginationState>((set, get) => ({
  page: 1,
  limit: 10,
  userIdFilter: null,
  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ page: 1, limit }),
  setUserIdFilter: (userIdFilter) => set({ page: 1, userIdFilter }),
  getSkip: () => (get().page - 1) * get().limit,
}));
