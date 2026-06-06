import { Search } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <Search className="w-16 h-16 text-blue-500 mx-auto mb-4" />
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-2">
          404
        </h1>
        <p className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Page Not Found
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition"
          >
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
