import type { NextConfig } from "next";

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];
const wordpressSiteUrl = process.env.WORDPRESS_SITE_URL?.trim();

if (wordpressSiteUrl) {
  const siteUrl = new URL(wordpressSiteUrl);
  remotePatterns.push({
    protocol: siteUrl.protocol.replace(":", "") as "http" | "https",
    hostname: siteUrl.hostname,
    pathname: "/**",
  });
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns,
  },
};

export default nextConfig;
