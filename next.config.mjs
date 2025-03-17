/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['blog.hoshizora.online', 'localhost'],
  },
  
  experimental: { 
    outputFileTracingRoot: process.cwd(),
  }
};