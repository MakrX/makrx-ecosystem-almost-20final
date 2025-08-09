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
};

module.exports = nextConfig;
