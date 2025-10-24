import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mypcp.us",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**", // allow all https images
      },
      {
        protocol: "http",
        hostname: "**", // allow all http images (optional)
      },
    ],
  },
};

export default nextConfig;
