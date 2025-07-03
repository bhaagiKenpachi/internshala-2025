const nextConfig = {
  reactStrictMode: true,
  env: {
    BACKEND_URL: process.env.BACKEND_URL
  },
  images: {
    domains: ['your-image-source.com', 'img.youtube.com']
  }
};
module.exports = nextConfig;
