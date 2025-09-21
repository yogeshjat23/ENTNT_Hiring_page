import React, { Component } from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, countdown: 3 };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    this.startCountdown();
  }

  startCountdown = () => {
    this.interval = setInterval(() => {
      this.setState(prevState => ({ countdown: prevState.countdown - 1 }), () => {
        if (this.state.countdown === 0) {
          clearInterval(this.interval);
          window.location.reload();
        }
      });
    }, 1000);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="error-boundary-overlay">
          <div className="error-boundary-box">
            <h2>Oops! Something went wrong.</h2>
            <p>An unexpected error occurred. We're trying to fix it for you.</p>
            <p>Refreshing in {this.state.countdown} seconds...</p>
            <div className="loader-container-error">
                <div className="spinner-box">
                    <div className="cube-face front"></div>
                    <div className="cube-face back"></div>
                </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;