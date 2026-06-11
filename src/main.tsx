import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { seedIfEmpty } from './lib/seedData';
import './index.css';

// 初始化种子数据（仅 localStorage 为空时）
seedIfEmpty();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/Apply">
      <App />
    </BrowserRouter>
  </StrictMode>
);
