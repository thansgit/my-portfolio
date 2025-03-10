/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Optimize images by default
    formats: ['image/avif', 'image/webp'],
  },
  // Enable streaming response for improved UX
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'thanski.dev'],
    },
  },
  // Increase stability by limiting concurrency during builds
  staticPageGenerationTimeout: 120,
  // Improve compression for better performance
  compress: true,
  // Leverage React 18's Streaming SSR
  reactStrictMode: true,
  // Optimize for production
  swcMinify: true,
}

module.exports = nextConfig 