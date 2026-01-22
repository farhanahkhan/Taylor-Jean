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
      {
        protocol: "https",
        hostname: "pub-a282791a5a174e8daa69fcf36a7fd132.r2.dev",
      },
      {
        protocol: "https",
        hostname: "img.drz.lazcdn.com",
      },
    ],
  },
};

module.exports = nextConfig;
