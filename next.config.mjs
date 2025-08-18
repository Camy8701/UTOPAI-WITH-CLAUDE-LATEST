/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable proper error checking for production builds
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    // Re-enable image optimization for better performance
    unoptimized: false,
    domains: ['placeholder.svg'], // Add your image domains here
  },
}

export default nextConfig
