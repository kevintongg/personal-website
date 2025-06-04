import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  server: {
    // Only use HTTPS during development (vite dev), not during build (vite build)
    ...(command === 'serve' && {
      https: {
        key: './localhost+2-key.pem',
        cert: './localhost+2.pem',
      },
    }),
    host: true, // Allow access from network
  },
}));
