/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    domains: [
      "blog.hoshizora.online",
      "pub-2aeb1c6581944036b080b925243768cb.r2.dev",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-2aeb1c6581944036b080b925243768cb.r2.dev",
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
