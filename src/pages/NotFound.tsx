import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-slate-900 p-6">
            <div className="text-center space-y-8 max-w-md">
                {/* 404 Illustration */}
                <div className="relative">
                    <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-6xl">💸</div>
                    </div>
                </div>

                {/* Message */}
                <div className="space-y-3">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Page Not Found
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Oops! Looks like this page went on an unexpected spending spree and disappeared.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25"
                    >
                        <Home size={20} />
                        Go to Dashboard
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        Go Back
                    </button>
                </div>

                {/* Helpful Links */}
                <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                        Quick Links:
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center text-sm">
                        <Link to="/transactions" className="text-blue-600 dark:text-blue-400 hover:underline">
                            Transactions
                        </Link>
                        <Link to="/budgets" className="text-blue-600 dark:text-blue-400 hover:underline">
                            Budgets
                        </Link>
                        <Link to="/savings" className="text-blue-600 dark:text-blue-400 hover:underline">
                            Savings Goals
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
