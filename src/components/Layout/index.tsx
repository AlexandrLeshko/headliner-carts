import { Outlet } from 'react-router-dom';
import { Header, Main, StyledLink, Wrapper } from './Layout.styles';

export const Layout = () => (
  <Wrapper>
    <Header>
      <StyledLink to="/">Carts</StyledLink>
    </Header>
    <Main>
      <Outlet />
    </Main>
  </Wrapper>
);
