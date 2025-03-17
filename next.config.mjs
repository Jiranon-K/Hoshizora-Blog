/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['blog.hoshizora.online'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blog.hoshizora.online',
        pathname: '/uploads/**',
      },
    ],
  }
};

export default nextConfig;