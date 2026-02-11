/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.supabase.co',
            },
        ],
    },
    async redirects() {
        return [
            {
                source: '/doc/api',
                destination: '/docs/api',
                permanent: true,
            },
            {
                source: '/doc/API',
                destination: '/docs/api',
                permanent: true,
            },
            {
                source: '/api-docs',
                destination: '/docs/api',
                permanent: true,
            },
        ]
    },
};

module.exports = nextConfig;
