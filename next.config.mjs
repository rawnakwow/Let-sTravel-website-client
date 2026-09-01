/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      // Google profile images
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },

      // Unsplash ticket images
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },

      // ImgBB uploaded images
      {
        protocol: "https",
        hostname: "i.ibb.co",
        pathname: "/**",
      },

      // Imgur
      {
        protocol: "https",
        hostname: "i.imgur.com",
        pathname: "/**",
      },

      // Old demo images - can remove later
      {
        protocol: "https",
        hostname: "loremflickr.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;