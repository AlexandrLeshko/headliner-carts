import type { ButtonHTMLAttributes } from 'react';
import { StyledButton } from './Button.styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'danger';
};

export const Button = (props: ButtonProps) => <StyledButton {...props} />;
