import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

export const Wrapper = styled.div<{ $faded?: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  min-height: 0;
  opacity: ${({ $faded }) => ($faded ? 0.7 : 1)};
  transition: opacity 0.2s;
`;

export const Nav = styled.nav`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.accent};
  padding: 2rem 1.5rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 4fr 1fr;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: 7fr 1fr;
  }
`;

export const FormLabel = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-weight: 600;
`;

export const CartList = styled.ul`
  flex: 1;
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
  align-content: start;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

export const CartLink = styled(Link)`
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  padding: 0.5rem 0.35rem 0.5rem 0.5rem;
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  transition: all 0.2s;

  &:hover, &:focus {
    transform: translate(-0.1rem, -0.1rem);
    box-shadow: 0.2rem 0.2rem 0 0 ${({ theme }) => theme.colors.shadow};
  }

  &:active {
    transform: translate(0, 0);
    box-shadow: 0 0 0 0 ${({ theme }) => theme.colors.shadow};
  }
`;

export const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

export const PageInfo = styled.span``;

export const PageInfoStrong = styled.span`
  font-weight: 800;
`;
