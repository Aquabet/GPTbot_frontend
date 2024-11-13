import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  /* eslint-disable-next-line no-undef */
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    build: {
      outDir: env.VITE_BUILD_OUT_DIR || 'dist',
    },
  };
});
