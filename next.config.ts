import type { NextConfig } from "next";

// Serves the Mintlify docs at /docs, per https://www.mintlify.com/docs/deploy/vercel.md
// (same rewrites work on Netlify's Next runtime). Also needs
// juno.bitsofgood.org/docs added under Custom domain in the Mintlify dashboard.
const DOCS = "https://juno-docs.mintlify.site";

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/_mintlify/:path*",
          destination: `${DOCS}/_mintlify/:path*`,
        },
        {
          source: "/api/request",
          destination: `${DOCS}/_mintlify/api/request`,
        },
        { source: "/docs", destination: `${DOCS}/docs` },
        { source: "/docs/:match*", destination: `${DOCS}/docs/:match*` },
        {
          source: "/mintlify-assets/:path+",
          destination: `${DOCS}/mintlify-assets/:path+`,
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
