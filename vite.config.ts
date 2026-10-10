import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// Automatically detect the base path:
// 1. If BASE_PATH environment variable is set (e.g. from GitHub Actions actions/configure-pages), use it.
// 2. If running on GitHub Actions (GITHUB_REPOSITORY is set, e.g. "owner/repo"), determine if it's
//    a user/organization page (owner.github.io -> "/") or a project page (owner/repo -> "/repo/").
// 3. Otherwise default to "./" (relative) so built files work anywhere without a fixed root domain.
function getBasePath(): string {
  if (process.env.BASE_PATH) {
    let base = process.env.BASE_PATH.trim();
    if (!base.startsWith('/')) base = `/${base}`;
    if (!base.endsWith('/')) base = `${base}/`;
    return base;
  }
  if (process.env.GITHUB_REPOSITORY) {
    const parts = process.env.GITHUB_REPOSITORY.split('/');
    const owner = parts[0]?.toLowerCase();
    const repo = parts[1]?.toLowerCase();
    if (repo && owner && repo === `${owner}.github.io`) {
      return '/';
    }
    return parts[1] ? `/${parts[1]}/` : './';
  }
  return './';
}

export default defineConfig(() => {
  return {
    base: getBasePath(),
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
