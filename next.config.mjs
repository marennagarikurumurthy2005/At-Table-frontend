/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    turbo: false, // disables Turbopack (use standard Webpack for better compatibility)
  },
};

export default nextConfig;
