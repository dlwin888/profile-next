import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.API_URL || "https://api.m3u8player.com.cn/api/:path*",
      },
    ];
  },
};

export default nextConfig;