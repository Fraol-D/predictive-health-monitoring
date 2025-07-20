/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['geist'],
  async rewrites() {
    return [
      {
        source: '/api/phone-verification/:path*',
        destination: 'http://localhost:3001/api/phone-verification/:path*',
      },
      // Add other rewrites if needed
    ];
  },
};
 
export default nextConfig; 