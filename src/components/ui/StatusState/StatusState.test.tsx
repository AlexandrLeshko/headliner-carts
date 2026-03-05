import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';
import { StatusState } from './index';
import { theme } from '../../../theme';

const renderWithTheme = (ui: React.ReactNode) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('StatusState', () => {
  it('renders the title', () => {
    renderWithTheme(<StatusState title="Loading..." />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders the description when provided', () => {
    renderWithTheme(
      <StatusState title="Error" description="Something broke" />,
    );
    expect(screen.getByText('Something broke')).toBeInTheDocument();
  });

  it('renders an icon when provided', () => {
    renderWithTheme(
      <StatusState title="Oops" icon={<span data-testid="icon">!</span>} />,
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('renders an action when provided', () => {
    renderWithTheme(
      <StatusState
        title="Error"
        action={<button>Retry</button>}
      />,
    );
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('has role="status"', () => {
    renderWithTheme(<StatusState title="Loading" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('passes aria props to wrapper', () => {
    renderWithTheme(
      <StatusState title="Loading..." aria-live="polite" aria-busy={true} />,
    );
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveAttribute('aria-busy', 'true');
  });

  it('renders full-page variant', () => {
    const { container } = renderWithTheme(
      <StatusState fullPage title="404" />,
    );
    expect(container.querySelector('[role="status"]')).toBeInTheDocument();
  });
});
