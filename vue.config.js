const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
  devServer: {
    port: 3000, // 개발 서버 포트 설정
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 백엔드 서버 주소
        changeOrigin: true,
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'src/')
      }
    }
  },
  transpileDependencies: true
})
