/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable strict mode for better React practices
  reactStrictMode: true,

  // Optimize for Vercel deployment
  output: 'standalone',

  // Add headers for API reliability
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ]
  },

  // Image optimization for Vercel
  images: {
    domains: [],
    unoptimized: true,
  },
}

export default nextConfig