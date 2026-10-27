import { defineConfig } from 'vite';

// The client lives in src/client. Env files (.env) are read from the project root.
export default defineConfig({
  root: 'src/client',
  envDir: '../..',
  server: { port: 5173 },
  build: {
    outDir: '../../dist-client',
    emptyOutDir: true,
  },
});
