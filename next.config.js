/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  distDir: 'fractal-pixels',
  // set these so that the build works on github pages
  basePath: process.env.NODE_ENV === 'production' ? '/fractal-pixels' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/fractal-pixels' : '',
}

module.exports = nextConfig
