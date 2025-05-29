/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'jira-bucket09.s3.eu-north-1.amazonaws.com',
          },
           {
            protocol: 'https',
            hostname: 'lh3.googleusercontent.com',
          },
        ],
      },
};

export default nextConfig;
