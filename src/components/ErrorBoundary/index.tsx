import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { StatusState } from '@components/ui';
import { CircleAlert, RotateCw } from 'lucide-react';
import { ResetButton } from './ErrorBoundary.styles';

type Props = { children: ReactNode };
type State = { hasError: boolean; error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <StatusState
          fullPage
          icon={<CircleAlert size={24} />}
          title="Something went wrong"
          description={this.state.error?.message}
          action={
            <ResetButton type="button" onClick={this.handleReset}>
              <RotateCw size={24} />
              <span>Try again</span>
            </ResetButton>
          }
        />
      );
    }
    return this.props.children;
  }
}
