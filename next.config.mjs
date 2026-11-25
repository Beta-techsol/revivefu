/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    deviceSizes: [640, 828, 1200, 1920],
    imageSizes: [32, 64, 128, 256, 384],
    formats: ['image/webp'],
    minimumCacheTTL: 2592000, // 30 days caching to minimize Vercel image transformations
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async headers() {
    const staticAssetHeaders = [
      {
        key: 'Cache-Control',
        value: 'public, max-age=604800, stale-while-revalidate=2592000',
      },
    ]

    return [
      { source: '/showcase/:path*', headers: staticAssetHeaders },
      { source: '/new-arrivals/:path*', headers: staticAssetHeaders },
      { source: '/hero/:path*', headers: staticAssetHeaders },
      { source: '/testimonials/:path*', headers: staticAssetHeaders },
      { source: '/curated/:path*', headers: staticAssetHeaders },
      { source: '/images/:path*', headers: staticAssetHeaders },
      { source: '/about/:path*', headers: staticAssetHeaders },
      { source: '/contact/:path*', headers: staticAssetHeaders },
      { source: '/shop/:path*', headers: staticAssetHeaders },
      { source: '/categories/:path*', headers: staticAssetHeaders },
      { source: '/products/:path*', headers: staticAssetHeaders },
      { source: '/portfolio/:path*', headers: staticAssetHeaders },
    ]
  },
  swcMinify: true,
  webpack: (config, { isServer }) => {
    return config
  },
}

export default nextConfig
