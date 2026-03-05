import { create } from 'zustand';
import { PAGINATION_DEFAULTS } from '@api/constants';
import type { PaginationState } from './types';

export const usePaginationStore = create<PaginationState>((set) => ({
  page: PAGINATION_DEFAULTS.page,
  limit: PAGINATION_DEFAULTS.limit,
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
}));

export const selectSkip = (state: PaginationState) =>
  (state.page - 1) * state.limit;
