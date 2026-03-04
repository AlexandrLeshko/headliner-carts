import styled from '@emotion/styled';

type StyledButtonProps = {
  variant?: 'default' | 'danger';
};

export const StyledButton = styled.button<StyledButtonProps>`
  display: inline-flex;
  gap: 0.25rem;
  border: 2px solid ${({ theme }) => theme.colors.border};

  svg:first-child {
    margin-left: -0.25rem;
  }
  svg:last-child:not(:first-child) {
    margin-right: -0.25rem;
  }
  padding: 0.25rem 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: all 0.2s;

  background-color: ${({ theme, variant }) =>
    variant === 'danger' ? theme.colors.buttonDanger : theme.colors.buttonDefault};

  &:hover:not(:disabled),
  &:focus:not(:disabled) {
    transform: translate(-0.1rem, -0.1rem);
    box-shadow: 0.2rem 0.2rem 0 0 ${({ theme }) => theme.colors.shadow};
    background-color: ${({ theme, variant }) =>
      variant === 'danger' ? theme.colors.buttonDangerHover : theme.colors.buttonDefaultHover};
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }

  &:active:not(:disabled) {
    box-shadow: 0 0 0 0 ${({ theme }) => theme.colors.shadow};
    transform: translate(0, 0);
    background-color: ${({ theme, variant }) =>
      variant === 'danger' ? theme.colors.buttonDanger : theme.colors.buttonDefault};
  }
`;
