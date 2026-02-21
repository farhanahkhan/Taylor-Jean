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
      {
        protocol: "https",
        hostname: "404b1b6975af8c5105361c5803268457.r2.cloudflarestorage.com",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
