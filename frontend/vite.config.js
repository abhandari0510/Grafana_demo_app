import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import faroUploader from '@grafana/faro-rollup-plugin';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const port = Number(env.FRONTEND_PORT || 5173);
  const backendTarget = env.VITE_BACKEND_PROXY_TARGET || 'http://localhost:8080';

  return {
    plugins: [
      react(),
      faroUploader({
        appName: 'Astra Tasks Console',
        endpoint: 'https://faro-api-prod-ap-south-0.grafana.net/faro/api/v1',
        appId: '136',
        stackId: '542048',
        verbose: true,
        apiKey: '',
        gzipContents: true,
      })
    ],
    server: {
      host: '0.0.0.0',
      port,
      proxy: {
        '/api': {
          target: backendTarget,
          changeOrigin: true,
          secure: false
        }
      }
    }
  };
});
