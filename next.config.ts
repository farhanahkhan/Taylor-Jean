/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "m.media-amazon.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "img.sonofatailor.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "mobileapp.designswebs.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
