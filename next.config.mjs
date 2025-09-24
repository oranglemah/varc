/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { serverActions: { allowedOrigins: ["*"] } },

  // matikan langkah ESLint saat build (hanya jika perlu)
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
