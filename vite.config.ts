import { fileURLToPath, URL } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/** Fontsource: keep latin + latin-ext only (the page has no Cyrillic, Greek or Vietnamese text) */
function trimFonts(): Plugin {
  return {
    name: 'trim-fonts',
    enforce: 'pre',
    transform(code, id) {
      if (/@fontsource(-variable)?\/.+\.css$/.test(id)) {
        return code.replace(/\/\*[^*]*-(?:cyrillic-ext|cyrillic|greek-ext|greek|vietnamese)-[^*]*\*\/\s*@font-face\s*\{[^}]*\}/g, '');
      }
      return null;
    },
  };
}

// `npm run build` -> dist/ (static site for GitHub Pages)
export default defineConfig({
  base: './',
  plugins: [trimFonts(), react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime', 'motion/react', 'gsap', 'gsap/ScrollTrigger', '@gsap/react'],
  },
  build: { outDir: 'dist', chunkSizeWarningLimit: 4000 },
});
