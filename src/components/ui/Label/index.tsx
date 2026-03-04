import { StyledLabel } from './Label.styles';

type LabelProps = {
  children: React.ReactNode;
};

export const Label = ({ children }: LabelProps) => (
  <StyledLabel>{children}</StyledLabel>
);
