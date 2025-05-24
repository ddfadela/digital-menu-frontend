import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEST_API: process.env.NEST_API,
  },
};

export default nextConfig;
