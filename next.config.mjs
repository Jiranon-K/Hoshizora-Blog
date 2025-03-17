/** @type {import('next').NextConfig} */
const nextConfig = {
    
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
     assetPrefix: 'https://blog.hoshizora.online',
  };
  
  export default nextConfig;