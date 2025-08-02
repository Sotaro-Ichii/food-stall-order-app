/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force dynamic rendering for all pages
  output: 'standalone',
  // Disable static optimization
  trailingSlash: false,
  generateEtags: false,
}

module.exports = nextConfig 