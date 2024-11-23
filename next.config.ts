import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",         
        destination: "http://localhost:8080/:path*", 
      },
    ];
  },
  images: {
    domains: [
      "www.mcgill.ca",
      "muhc.ca",
      "www.smhc.qc.ca",
      "www.decasult.com",
      "images.loopnet.ca",
      "upload.wikimedia.org",
      "imtl.org",
      "monde.ccdmd.qc.ca",
    ],
  }
};

export default nextConfig;
