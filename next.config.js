module.exports = {
  reactStrictMode: true,
  target: "serverless",
  /**
   * If using a CDN or a headless cms for image optimization refer to the docs
   * https://nextjs.org/docs/basic-features/image-optimization#configuration
   */
  images: {
    deviceSizes: [420, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
};
