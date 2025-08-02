/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static generation for pages that use Firebase
  experimental: {
    appDir: true,
  },
  // Force dynamic rendering for all pages
  output: 'standalone',
  // Disable static optimization
  trailingSlash: false,
  generateEtags: false,
}

module.exports = nextConfig 