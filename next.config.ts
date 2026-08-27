import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.google.com", pathname: "/s2/favicons" },
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  compress: true,
};

export default nextConfig;
