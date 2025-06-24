/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['restapi.amap.com', 'webapi.amap.com'],
  },
}

module.exports = nextConfig