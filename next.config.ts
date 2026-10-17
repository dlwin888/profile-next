import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        //destination: "http://localhost:8001/api/:path*",
        destination: "https://api.m3u8player.com.cn/api/:path*",
      },
    ];
  },
};

export default nextConfig;