/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: [
      "blog.yuhari.app",
      "pub-2aeb1c6581944036b080b925243768cb.r2.dev",
      "r2.yuhari.app",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-2aeb1c6581944036b080b925243768cb.r2.dev",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "blog.yuhari.app",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "r2.yuhari.app",
        pathname: "/**",
      },
    ],
  },

  experimental: {
    outputFileTracingRoot: process.cwd(),
  },

  outputFileTracing: true,
};

export default nextConfig;
