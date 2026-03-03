import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export const Header = styled.header`
  padding: 1rem 2rem;
  background: #000000;
`;

export const StyledLink = styled(Link)`
  color: #ffffff;
`;

export const Main = styled.main`
  flex: 1;
  padding: 1rem 2rem;
`;
