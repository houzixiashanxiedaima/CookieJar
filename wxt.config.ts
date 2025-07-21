import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    host_permissions: ["<all_urls>"],
    permissions: ["cookies"],
  },
  runner: {
    // 禁用自动启动浏览器，手动在 Edge 中加载
    disabled: true,
  },
  // 开发服务器配置
  dev: {
    server: {
      port: 3000,
    },
  },
});
