import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-gray-600 max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link 
        href="/" 
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="Return to home page"
        tabIndex={0}
      >
        Return Home
      </Link>
    </div>
  );
} 