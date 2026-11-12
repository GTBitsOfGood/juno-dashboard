import type { NextConfig } from "next";

const DOCS_URL = "https://juno-docs.mintlify.site";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/docs", destination: DOCS_URL, permanent: false },
      {
        source: "/docs/:path*",
        destination: `${DOCS_URL}/:path*`,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
