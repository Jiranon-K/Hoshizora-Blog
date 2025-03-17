/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // ใช้ standalone output
  images: {
    domains: ['blog.hoshizora.online'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blog.hoshizora.online',
        pathname: '/uploads/**',
      },
    ],
  },
};

export default nextConfig;