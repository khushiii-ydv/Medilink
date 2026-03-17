import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('MediLink Error Boundary caught:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '60vh', padding: 40, textAlign: 'center',
        }}>
          <h2 style={{ color: 'var(--danger, #ef4444)', marginBottom: 12 }}>Something went wrong</h2>
          <p style={{ color: 'var(--text-secondary, #888)', marginBottom: 24, maxWidth: 480 }}>
            {this.state.error?.message || 'An unexpected error occurred. Please try refreshing the page.'}
          </p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = '/'; }}
            style={{
              padding: '10px 28px', background: 'var(--primary-500, #3b82f6)', color: '#fff',
              border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem',
            }}
          >
            Go to Home
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
