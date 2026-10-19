/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three'],
  experimental: { optimizePackageImports: ['@mui/material', '@mui/icons-material'] },
};
export default nextConfig;
