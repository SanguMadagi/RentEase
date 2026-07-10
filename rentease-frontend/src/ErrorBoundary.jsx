//import React from "react";
//import { Container, Alert, Button } from "react-bootstrap";
//
//class ErrorBoundary extends React.Component {
//  constructor(props) {
//    super(props);
//    this.state = { hasError: false, error: null };
//  }
//
//  static getDerivedStateFromError(error) {
//    return { hasError: true, error };
//  }
//
//  componentDidCatch(error, errorInfo) {
//    console.error("Error caught by boundary:", error, errorInfo);
//  }
//
//  render() {
//    if (this.state.hasError) {
//      return (
//        <Container className="mt-5">
//          <Alert variant="danger">
//            <Alert.Heading>Something went wrong</Alert.Heading>
//            <p>{this.state.error?.message || "An unexpected error occurred"}</p>
//            <Button
//              variant="primary"
//              onClick={() => {
//                this.setState({ hasError: false, error: null });
//                window.location.href = "/";
//              }}
//            >
//              Go to Home
//            </Button>
//          </Alert>
//        </Container>
//      );
//    }
//
//    return this.props.children;
//  }
//}
//
//export default ErrorBoundary;

import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-xl mx-auto mt-20 p-6 bg-red-50 border border-red-200 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-red-700 mb-4">
            Something went wrong
          </h2>
          <p className="text-red-600 mb-6">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.href = "/";
            }}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
