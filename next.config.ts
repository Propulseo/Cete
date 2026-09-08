import type { NextConfig } from "next";
import { withSentryConfig } from '@sentry/nextjs/config';
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Images de couverture du blog (bucket public Supabase Storage)
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default withSentryConfig(withNextIntl(nextConfig), {
  sentryUrl: 'https://errors.propulseo-site.com',
  org: 'propulseo',
  project: 'cete',
  authToken: process.env.GLITCHTIP_AUTH_TOKEN,
  sourcemaps: { disable: !process.env.GLITCHTIP_AUTH_TOKEN },
  telemetry: false,
  silent: !process.env.CI,
});
