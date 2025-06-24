/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['restapi.amap.com', 'webapi.amap.com'],
  },
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig