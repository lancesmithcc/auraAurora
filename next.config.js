/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // We need to enable the experimental serverActions for API calls
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000']
    }
  },
}

module.exports = nextConfig 