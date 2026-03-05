import styled from '@emotion/styled';

export const SkipLink = styled.a`
  position: absolute;
  left: -9999px;
  top: 0;
  z-index: 100;
  padding: 0.5rem 1rem;
  background-color: ${({ theme }) => theme.colors.buttonDefault};
  border: 2px solid ${({ theme }) => theme.colors.border};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    left: 0.5rem;
    top: 0.5rem;
  }
`;

export const Main = styled.main`
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.pageBg};

  &:focus {
    outline: none;
  }
`;

export const Inner = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 1rem;

  @media (min-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 1.5rem;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.desktop}) {
    padding: 2rem;
  }
`;
