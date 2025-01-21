import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import 'sonner/dist/styles.css';

// 创建一个函数来获取挂载点
const getMountPoint = () => {
  // 检查是否存在 shadow DOM 容器（生产环境）
  const container = document.getElementById('$$ezclip-core-container$$');
  if (container?.shadowRoot) {
    const root = container.shadowRoot.getElementById('$$ezclip-core-root$$');
    if (root) return root;
  }

  // 开发环境：直接创建一个新的 div 并挂载到 body
  const root = document.createElement('div');
  document.body.appendChild(root);
  return root;
};

// 渲染应用
ReactDOM.createRoot(getMountPoint()).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);