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
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'PLACEHOLDER_BACKEND_URL',
    NEXT_PUBLIC_GA_TAG: process.env.NEXT_PUBLIC_GA_TAG || 'PLACEHOLDER_GA_TAG',
  },
};

export default nextConfig;
