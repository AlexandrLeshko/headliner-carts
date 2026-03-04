import type { theme } from './index';

declare module '@emotion/react' {
  export interface Theme {
    colors: typeof theme.colors;
    breakpoints: typeof theme.breakpoints;
  }
}
