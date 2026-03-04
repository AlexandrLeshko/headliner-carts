import { breakpoints } from './breakpoints';
import { colors } from './colors';

export const theme = {
  colors,
  breakpoints,
} as const;

export type Theme = typeof theme;
