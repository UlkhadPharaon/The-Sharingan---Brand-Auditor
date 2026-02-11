import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Charge les variables d'environnement (comme API_KEY sur Vercel)
  const env = loadEnv(mode, (process as any).cwd(), '');

  return {
    plugins: [react()],
    define: {
      // Cette ligne est CRITIQUE : elle remplace 'process.env.API_KEY' dans le code
      // par la vraie valeur lors du build sur Vercel.
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});