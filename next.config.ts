import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/receipt-generator',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
