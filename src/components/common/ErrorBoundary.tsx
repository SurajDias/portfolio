import { Component, type ErrorInfo, type ReactNode } from "react";
import { EMAIL } from "../../config/site";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Portfolio render error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex min-h-screen items-center bg-[#050816] px-5 text-slate-100">
          <div className="mx-auto w-full max-w-xl rounded-2xl border border-white/[.09] bg-[#0b1220]/70 p-8 sm:p-10">
            <p className="text-[11px] font-medium uppercase tracking-[.2em] text-sky-300">Portfolio unavailable</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-.04em]">Something went wrong.</h1>
            <p className="mt-4 leading-7 text-slate-400">Please refresh the page. If the issue continues, contact me by email.</p>
            <a href={`mailto:${EMAIL}`} className="interactive-button mt-7 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white shadow-[0_10px_24px_rgba(37,99,235,0.22)] hover:bg-blue-500 hover:shadow-[0_14px_28px_rgba(37,99,235,0.3)]">Email Suraj</a>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
