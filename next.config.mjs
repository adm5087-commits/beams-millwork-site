/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "img1.wsimg.com" }],
  },
  // Keep old GoDaddy links (Google results, Facebook posts) working.
  async redirects() {
    return [
      { source: "/portfolio", destination: "/work", permanent: true },
      { source: "/residential", destination: "/work/residential", permanent: true },
      { source: "/commercial", destination: "/work/commercial", permanent: true },
      { source: "/project-videos-1", destination: "/work", permanent: true },
      { source: "/join-our-team", destination: "/careers", permanent: true },
      { source: "/privacy-policy", destination: "/privacy", permanent: true },
      { source: "/terms-and-conditions", destination: "/privacy", permanent: true },
    ];
  },
};
export default nextConfig;
