/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "exuberant-penguin-209.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
