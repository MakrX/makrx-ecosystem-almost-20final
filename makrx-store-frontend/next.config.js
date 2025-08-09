/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'makrx.store', 'images.unsplash.com'],
    unoptimized: true
  },
  env: {
    CUSTOM_KEY: 'makrx-store',
  },
  devServerConfig: {
    allowedDevOrigins: [
      'e986654b5a5843d7b3f8adf13b61022c-556d114307be4dee892ae999b.fly.dev'
    ]
  }
}

module.exports = nextConfig
