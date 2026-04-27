/**
 * @file components/ErrorBoundary.tsx
 * @description React class-based Error Boundary for CREATEai by angieCREATEs.
 *
 * ## How React Error Boundaries work
 * Error boundaries are React class components that implement one or both of:
 *   - `static getDerivedStateFromError(error)` — updates state to trigger a fallback render
 *   - `componentDidCatch(error, info)` — useful for error reporting (e.g. Sentry)
 *
 * They catch errors thrown during rendering, in lifecycle methods, and in
 * constructors of the component tree *below* them. They do NOT catch errors
 * inside event handlers (use try/catch there) or async code (use .catch()).
 *
 * ## Usage
 * Wrap any subtree you want to protect:
 * ```tsx
 * <ErrorBoundary>
 *   <RouterProvider router={router} />
 * </ErrorBoundary>
 * ```
 * Or supply a custom fallback:
 * ```tsx
 * <ErrorBoundary fallback={<MyFallback />}>
 *   <StudioPage />
 * </ErrorBoundary>
 * ```
 */

import { BRAND_SHORT } from "@/constants/brand";
import React from "react";

// ── Props & State ─────────────────────────────────────────────────────────

interface ErrorBoundaryProps {
  /** The component subtree to protect. Required. */
  children: React.ReactNode;
  /**
   * Optional custom fallback UI. When omitted the built-in dark luxury
   * fallback matching the CREATEai theme is shown.
   */
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  /** Whether an error has been caught and the fallback should render. */
  hasError: boolean;
  /** The caught error, stored for potential logging. */
  error: Error | null;
}

// ── Component ─────────────────────────────────────────────────────────────

/**
 * ErrorBoundary wraps any part of the React tree and catches render errors
 * before they crash the whole page. On error it renders a themed fallback
 * with a 'Return Home' recovery action.
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * Called during rendering when a descendant throws.
   * Returning the new state causes React to re-render with the fallback.
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  /**
   * Called after an error has been caught. Ideal hook for sending
   * error details to an observability service (e.g. Sentry, Datadog).
   */
  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    // In production, replace this with a proper error reporting call.
    console.error("[ErrorBoundary] Caught render error:", error, info);
  }

  /** Reset state so the user can try again without a full page reload. */
  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    const { hasError } = this.state;
    const { children, fallback } = this.props;

    if (!hasError) return children;

    // Prefer a custom fallback if provided
    if (fallback) return fallback;

    // ── Default dark luxury fallback ──────────────────────────────────────
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0b",
          padding: "2rem",
          textAlign: "center",
          fontFamily: "'Playfair Display', serif",
        }}
      >
        {/* Brand name */}
        <span
          style={{
            fontSize: "1.5rem",
            letterSpacing: "0.15em",
            color: "#c9a84c",
            fontWeight: 700,
            textTransform: "uppercase",
            marginBottom: "2rem",
            display: "block",
          }}
        >
          {BRAND_SHORT}
        </span>

        {/* Error icon */}
        <div
          style={{
            width: "4rem",
            height: "4rem",
            borderRadius: "50%",
            border: "1px solid #c9a84c55",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.5rem",
            fontSize: "1.75rem",
          }}
          aria-hidden="true"
        >
          ✦
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 600,
            color: "#f5f0e8",
            marginBottom: "0.75rem",
          }}
        >
          Something Unexpected Happened
        </h1>

        {/* Subtext */}
        <p
          style={{
            color: "#a09080",
            fontSize: "1rem",
            maxWidth: "30rem",
            lineHeight: 1.6,
            marginBottom: "2rem",
          }}
        >
          Our team has been notified. Let's get you back to creating something
          beautiful.
        </p>

        {/* Recovery button */}
        <button
          type="button"
          onClick={this.handleReset}
          style={{
            padding: "0.75rem 2rem",
            background: "transparent",
            border: "1px solid #c9a84c",
            color: "#c9a84c",
            borderRadius: "0.25rem",
            fontSize: "0.875rem",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: "'Playfair Display', serif",
          }}
          onMouseOver={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#c9a84c";
            (e.currentTarget as HTMLButtonElement).style.color = "#0a0a0b";
          }}
          onFocus={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#c9a84c";
            (e.currentTarget as HTMLButtonElement).style.color = "#0a0a0b";
          }}
          onMouseOut={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "#c9a84c";
          }}
          onBlur={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "#c9a84c";
          }}
        >
          Return Home
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;
