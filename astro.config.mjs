import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.s3bc40.com',
  integrations: [sitemap()],
  output: 'static',
  trailingSlash: 'never',
});
