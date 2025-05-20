import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  distDir: process.env.NODE_ENV === 'development' ? '/tmp/phm-web-next-build' : '.next',
};

export default nextConfig;
