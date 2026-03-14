import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noai, noimageai, noarchive, nosnippet",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
