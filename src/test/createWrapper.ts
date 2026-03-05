import { createElement } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

type WrapperOptions = {
  mutations?: { retry: boolean };
};

export const createWrapper = (options?: WrapperOptions) => {
  const qc = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      ...(options?.mutations && { mutations: options.mutations }),
    },
  });
  const wrapper = ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: qc }, children);
  return { wrapper, qc };
};
