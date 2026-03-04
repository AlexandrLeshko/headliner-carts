import { Outlet } from 'react-router-dom';
import { Inner, Main } from './Layout.styles';

export const Layout = () => (
  <Main>
    <Inner>
      <Outlet />
    </Inner>
  </Main>
);
