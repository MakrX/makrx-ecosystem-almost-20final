const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["localhost", "makrx.store", "images.unsplash.com"],
    unoptimized: true,
  },
  env: {
    CUSTOM_KEY: "makrx-store",
  },
  experimental: {
    externalDir: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@makrx/ui': path.resolve(__dirname, '../packages/ui'),
      '@makrx/types': path.resolve(__dirname, '../packages/types'),
    };
    return config;
  },
};

module.exports = nextConfig;
