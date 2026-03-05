import { lazy } from 'react';
import type { ReactNode } from 'react';
import { ThemeProvider } from '@emotion/react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from '@components/Layout';
import { ErrorBoundary } from '@components/ErrorBoundary';
import { NotFoundPage } from '@pages/NotFound';
import { theme } from '@theme/index';
import { queryClient } from './queryClient';

const CartListPage = lazy(() =>
  import('@pages/CartList').then((m) => ({ default: m.CartListPage })),
);
const CartDetailPage = lazy(() =>
  import('@pages/CartDetail').then((m) => ({ default: m.CartDetailPage })),
);

const RouteErrorBoundary = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  return <ErrorBoundary key={pathname}>{children}</ErrorBoundary>;
};

export const App = () => {
  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route
                    index
                    element={
                      <RouteErrorBoundary>
                        <CartListPage />
                      </RouteErrorBoundary>
                    }
                  />
                  <Route
                    path="carts/:id"
                    element={
                      <RouteErrorBoundary>
                        <CartDetailPage />
                      </RouteErrorBoundary>
                    }
                  />
                </Route>
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>
          </QueryClientProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </HelmetProvider>
  );
};
