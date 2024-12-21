const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
  devServer: {
    port: 3000, // 개발 서버 포트 설정
    historyApiFallback: true, // 모든 라우팅 요청을 index.html로 리디렉션
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
