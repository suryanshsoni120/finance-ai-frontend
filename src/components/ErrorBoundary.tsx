import { Component, type ReactNode, type ErrorInfo } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Error caught by boundary:", error, errorInfo);
        // TODO: Log to error tracking service (Sentry, LogRocket, etc.)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-slate-900 p-6">
                    <div className="text-center space-y-6 max-w-md">
                        {/* Error Icon */}
                        <div className="flex justify-center">
                            <div className="p-4 rounded-full bg-red-100 dark:bg-red-900/30">
                                <AlertTriangle className="w-16 h-16 text-red-600 dark:text-red-400" />
                            </div>
                        </div>

                        {/* Message */}
                        <div className="space-y-3">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Oops! Something went wrong
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                We encountered an unexpected error. Don't worry, your data is safe.
                            </p>
                            {import.meta.env.DEV && this.state.error && (
                                <details className="text-left mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                    <summary className="cursor-pointer font-semibold text-sm text-gray-700 dark:text-gray-300">
                                        Error Details (Dev Only)
                                    </summary>
                                    <pre className="mt-2 text-xs text-red-600 dark:text-red-400 overflow-auto">
                                        {this.state.error.toString()}
                                    </pre>
                                </details>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={() => window.location.reload()}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
                            >
                                <RefreshCw size={20} />
                                Reload Page
                            </button>
                            <button
                                onClick={() => (window.location.href = "/")}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                <Home size={20} />
                                Go Home
                            </button>
                        </div>

                        {/* Support Info */}
                        <p className="text-sm text-gray-500 dark:text-gray-400 pt-4">
                            If this problem persists, please contact support.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
