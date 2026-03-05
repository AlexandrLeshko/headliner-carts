export interface PaginationState {
  page: number;
  limit: number;
  userIdFilter: number | null;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setUserIdFilter: (userId: number | null) => void;
}
