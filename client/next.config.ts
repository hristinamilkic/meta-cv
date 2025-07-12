import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Fix for handlebars require.extensions issue
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };

    // Ignore require.extensions warning for handlebars
    config.ignoreWarnings = [/require\.extensions is not supported by webpack/];

    return config;
  },
};

export default nextConfig;
