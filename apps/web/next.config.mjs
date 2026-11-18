/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@festiveui/core',
    '@festiveui/react',
    '@festiveui/next',
    '@festiveui/types'
  ]
};

export default nextConfig;
