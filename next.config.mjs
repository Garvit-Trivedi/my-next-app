/** @type {import('next').NextConfig} */
const nextConfig = {

      allowedDevOrigins: [
    'http://10.207.205.81:3000', // add your dev server origin + port
    'http://localhost:3000',     // useful if you also run locally
  ],
};

export default nextConfig;
