import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), '');
    var isProd = mode === 'production';
    return {
        plugins: [react()],
        server: {
            host: '0.0.0.0',
            port: 5173,
            strictPort: true,
            hmr: false,
            watch: {
                usePolling: false,
                ignored: ['**/*'],
            },
            proxy: {
                '/api': {
                    target: process.env.NODE_ENV === 'production'
                        ? 'https://api.auroville.social'
                        : 'http://127.0.0.1:5000',
                    changeOrigin: true
                }
            }
        },
        build: {
            outDir: 'dist',
            assetsDir: 'assets',
            sourcemap: false,
            chunkSizeWarningLimit: 2000,
            rollupOptions: {
                output: {
                    manualChunks: function (id) {
                        if (id.includes('node_modules')) {
                            return 'vendor';
                        }
                        return undefined;
                    }
                }
            }
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        preview: {
            port: 80,
            host: true,
            strictPort: true,
        }
    };
});