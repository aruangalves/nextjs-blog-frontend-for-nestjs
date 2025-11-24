import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  /**SSG GENERATION CONFIG: */
  /*output: 'export',
  images: {
    unoptimized: true,
  },*/
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
        search: '',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
        search: '',
      },
      //THIS IS NEEDED FOR IMAGES STORED ON _next/ FOLDER
      /*
      {
        protocol: 'https',
        hostname: 'YOUR-DOMAIN-NAME.COM.BR',
        port: '',
        pathname: '/**',
        search: '',
      },
      */
    ],
  },
};

export default nextConfig;
