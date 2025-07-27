import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 환경변수 로드
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    server: {
      port: 5174, // 현재 포트와 일치
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:8080',
          changeOrigin: true,
          secure: false,
          // 추가 CORS 헤더 설정
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq, req) => {
              console.log('🔄 프록시 요청:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req) => {
              console.log('✅ 프록시 응답:', proxyRes.statusCode, req.url);

              // CORS 헤더 강제 추가
              proxyRes.headers['Access-Control-Allow-Origin'] = '*';
              proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';
              proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Content-Length, X-Requested-With';
            });
            proxy.on('error', (err) => {
              console.error('❌ 프록시 에러:', err);
            });
          }
        }
      }
    }
  }
})