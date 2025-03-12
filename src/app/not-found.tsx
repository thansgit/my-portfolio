import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='flex min-h-[70vh] flex-col items-center justify-center px-4 text-center'>
      <h1 className='mb-4 text-6xl font-bold'>404</h1>
      <h2 className='mb-6 text-2xl font-semibold'>Page Not Found</h2>
      <p className='mb-8 max-w-md text-gray-600'>The page you are looking for doesn't exist or has been moved.</p>
      <Link
        href='/'
        className='rounded-md bg-blue-600 px-6 py-3 text-white transition-colors duration-300 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
        aria-label='Return to home page'
        tabIndex={0}
      >
        Return Home
      </Link>
    </div>
  )
}
