export const breakpoints = {
  tablet: '768px',
  desktop: '1024px',
} as const;

export type Breakpoints = typeof breakpoints;
