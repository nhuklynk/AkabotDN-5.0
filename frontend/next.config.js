/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "apiminio.nda.org.vn",
        port: "",
        pathname: "/dlqg/**",
      },
      // Development - localhost MinIO
      {
        protocol: "http",
        hostname: "localhost",
        port: "9000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "localhost",
        port: "9000", 
        pathname: "/**",
      },
      // Development - 127.0.0.1
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "9000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "127.0.0.1",
        port: "9000",
        pathname: "/**",
      },
      // External domains
      {
        protocol: "https",
        hostname: "example.com",
        pathname: "/**",
      },
    ],
    // Completely disable image optimization for development to avoid MinIO signed URL issues
    unoptimized: true,
  },
};

module.exports = nextConfig;