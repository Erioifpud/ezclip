import path from "path"
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import monkey, { cdn } from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    monkey({
      entry: 'src/main.tsx',
      userscript: {
        icon: 'https://vitejs.dev/logo.svg',
        namespace: 'npm/vite-plugin-monkey',
        match: ['*://*/*'],
      },
      build: {
        autoGrant: true,
        externalGlobals: {
          react: cdn.jsdelivr('React', 'umd/react.production.min.js'),
          'react-dom': cdn.jsdelivr(
            'ReactDOM',
            'umd/react-dom.production.min.js',
          ),
        },
        cssSideEffects: (css) => {
          const cssText = JSON.stringify(css);
          return `
            ;(() => {
              // 创建一个容器
              const container = document.createElement('div');
              container.id = '$$ezclip-core-container$$';
              // 附加 shadow DOM
              const shadow = container.attachShadow({ mode: 'open' });
              // 创建一个元素作为 React 的根节点
              const root = document.createElement('div');
              root.style.position = 'fixed';
              root.style.top = '0';
              root.style.left = '0';
              root.style.width = '0';
              root.style.height = '0';
              root.style.overflow = 'visible';
              root.id = '$$ezclip-core-root$$';
              // 创建样式标签
              const style = document.createElement('style');
              style.textContent = ${cssText};
              // 将样式和根节点添加到 shadow DOM
              shadow.appendChild(style);
              shadow.appendChild(root);
              // 将容器添加到页面
              document.body.appendChild(container);
            })();
          `;
        }
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
