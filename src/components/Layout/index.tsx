import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { StatusState } from '@components/ui';
import { Inner, Main, SkipLink } from './Layout.styles';

const PageFallback = () => <StatusState title="Loading..." aria-live="polite" aria-busy />;

export const Layout = () => (
  <>
    <SkipLink href="#main-content">Skip to content</SkipLink>
    <Main id="main-content" tabIndex={-1}>
      <Inner>
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </Inner>
    </Main>
  </>
);
