import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@emotion/react';
import { ErrorBoundary } from './index';
import { theme } from '../../theme';

const ThrowingComponent = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) throw new Error('Test error');
  return <div>Content rendered</div>;
};

const renderWithTheme = (ui: React.ReactNode) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('renders children when no error occurs', () => {
    renderWithTheme(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Content rendered')).toBeInTheDocument();
  });

  it('renders fallback UI when error occurs', () => {
    renderWithTheme(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('shows try again button that resets the error state', async () => {
    const user = userEvent.setup();

    const { rerender } = renderWithTheme(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>,
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    rerender(
      <ThemeProvider theme={theme}>
        <ErrorBoundary>
          <ThrowingComponent shouldThrow={false} />
        </ErrorBoundary>
      </ThemeProvider>,
    );

    await user.click(screen.getByText('Try again'));
    expect(screen.getByText('Content rendered')).toBeInTheDocument();
  });
});
