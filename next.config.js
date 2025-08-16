/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'uprayers.com' }],
        destination: 'https://www.uprayers.com/:path*',
        permanent: true,
      },
    ];
  },
};
module.exports = nextConfig;
