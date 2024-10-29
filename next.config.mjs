/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dojo-files-dev.tensorplex.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dojo-files-testnet.tensorplex.ai',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dojo-files.tensorplex.ai',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
