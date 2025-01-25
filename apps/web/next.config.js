/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Hosts needs to be configured, see https://nextjs.org/docs/messages/next-image-unconfigured-host
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s.gravatar.com",
        pathname: "/avatar/**",
      },
    ],
  },
};

export default nextConfig;
