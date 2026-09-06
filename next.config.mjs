/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.odt.co.nz',
        pathname: '/sites/default/files/**',
      },
    ],
  },
};

export default nextConfig;
