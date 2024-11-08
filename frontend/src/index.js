import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/styles/global.css';
import './assets/styles/bootstrap-overrides.css';
import './assets/styles/reset.css';

// 獲取根節點並創建 React 應用的入口
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App /> {/* 渲染主應用程序組件 App */}
    </React.StrictMode>
);

// 這段代碼是 React 應用的主要入口文件
// 1. 從 DOM 中獲取具有 id 'root' 的元素，並將應用程序掛載到該節點上。
// 2. 使用 ReactDOM.createRoot() 創建應用的根容器。
// 3. 使用 React.StrictMode 包裹應用，幫助檢測潛在問題，提供額外的警告和檢查。
