/** @type {import('next').NextConfig} */
const basePath = process.env.NODE_ENV === 'production' ? '/live-lake-cal' : '';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Configure for GitHub Pages deployment
  basePath,
}

module.exports = nextConfig