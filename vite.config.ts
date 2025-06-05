import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react(), tailwindcss()],
  server: {
    // Only use HTTPS during development (vite dev), not during build (vite build)
    ...(command === 'serve' && {
      https: {
        key: './localhost-key.pem',
        cert: './localhost.pem',
      },
    }),
    host: true, // Allow access from network
  },
}));
