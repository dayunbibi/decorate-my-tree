import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // the per-tree link preview reads this picture from disk, so ship it with that function
  outputFileTracingIncludes: {
    "/t/[id]/opengraph-image": ["./public/og-bg.jpg"],
  },
};

export default nextConfig;
