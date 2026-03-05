import styled from '@emotion/styled';

export const ResetButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.buttonDefault};
  color: ${({ theme }) => theme.colors.text};

  &:hover,
  &:focus-visible {
    transform: translate(-0.1rem, -0.1rem);
    box-shadow: 0.2rem 0.2rem 0 0 ${({ theme }) => theme.colors.shadow};
    background-color: ${({ theme }) => theme.colors.buttonDefaultHover};
  }
`;
