import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from 'tailwindcss';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel({
    webAnalytics: {
      enabled: false
    },
    speedInsights: {
      enabled: false
    }
  }),
  vite: {
    css: {
      postcss: {
        plugins: [tailwindcss()],
      },
    },
    ssr: {
      noExternal: ['@supabase/supabase-js']
    }
  }
});
