import styled from '@emotion/styled';

export const StyledInput = styled.input`
  border: 2px solid ${({ theme }) => theme.colors.border};
  padding: 0.5rem 0.75rem;
  flex: 1;
  transition: all 0.2s;
  font-size: 1rem;
  font-weight: 600;
  background-color: ${({ theme }) => theme.colors.surface};
  -moz-appearance: textfield;
  appearance: textfield;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }

  &:active:not(:disabled),
  &:focus:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.inputFocus};
    transform: translate(-0.1rem, -0.1rem);
    box-shadow: 0.2rem 0.2rem 0 0 ${({ theme }) => theme.colors.shadow};
  }
`;
