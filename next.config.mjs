/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "s2.coinmarketcap.com",
      },
    ],
  },
};

export default nextConfig;
