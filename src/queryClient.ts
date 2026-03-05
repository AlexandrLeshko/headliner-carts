import { QueryClient } from '@tanstack/react-query';
import { DEFAULT_STALE_TIME, DEFAULT_RETRY } from '@api/constants';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: DEFAULT_STALE_TIME,
      retry: DEFAULT_RETRY,
    },
  },
});
