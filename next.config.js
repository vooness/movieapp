/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: ['m.media-amazon.com'], // Allow loading images from this domain
    },
  };
  
  module.exports = nextConfig;
  