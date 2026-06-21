import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.pexels.com",
        pathname: "/v1/",
      },
    ],
  },
};

export default nextConfig;
