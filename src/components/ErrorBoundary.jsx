import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '100vh', padding: '2rem',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          background: '#f0f4f8', color: '#1e293b',
        }}>
          <div style={{
            background: '#fff', borderRadius: '12px', padding: '2rem',
            maxWidth: '480px', width: '100%', boxShadow: '0 4px 6px rgba(0,0,0,.07)',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
            <h2 style={{ marginBottom: '.5rem' }}>Något gick fel</h2>
            <p style={{ color: '#475569', marginBottom: '1.5rem', fontSize: '.9rem' }}>
              {this.state.error.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#6366f1', color: '#fff', border: 'none',
                borderRadius: '8px', padding: '.6rem 1.2rem', cursor: 'pointer',
                fontSize: '.9rem',
              }}
            >
              Ladda om sidan
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
