import styled from '@emotion/styled';

type WrapperProps = {
  $compact?: boolean;
  $fullPage?: boolean;
};

export const FullWidthBg = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.pageBg};
`;

export const Wrapper = styled.div<WrapperProps>`
  flex: 1;
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: ${({ $fullPage }) => ($fullPage ? '1280px' : 'none')};
  margin: ${({ $fullPage }) => ($fullPage ? '0 auto' : '0')};
  padding: ${({ $compact }) => ($compact ? '0' : '1rem')};

  ${({ $compact, theme }) =>
    !$compact &&
    `
    @media (min-width: ${theme.breakpoints.tablet}) {
      padding: 1.5rem;
    }
    @media (min-width: ${theme.breakpoints.desktop}) {
      padding: 2rem;
    }
  `}
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.25rem;
`;

export const Title = styled.p`
  font-size: 1.5rem;
  font-weight: 800;
`;

export const Description = styled.p`
  font-size: 1rem;
  font-weight: 600;
`;
