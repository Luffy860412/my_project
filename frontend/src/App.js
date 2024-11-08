import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './assets/components/Sidebar';
import Header from './assets/components/Header';
import Login from './assets/pages/Login';
import Signup from './assets/pages/Signup';
import Home from './assets/pages/Home';
import CustomerList from './assets/pages/CustomerList';
import CustomerAnalysis from './assets/pages/CustomerAnalysis';
import PolicyManagement from './assets/pages/PolicyManagement';
import AuthContext, { AuthProvider } from './assets/context/AuthContext'; // 引入 AuthProvider 和 AuthContext
import './assets/styles/global.css';

// 主應用程序組件
function App() {
    return (
        <AuthProvider>
            <Router>
                <AppContent />
            </Router>
        </AuthProvider>
    );
}

// 定義內容組件，根據路徑動態顯示或隱藏 Sidebar 和 Header
function AppContent() {
    const location = useLocation(); // 使用 useLocation 獲取當前路徑
    const isAuthPage = ['/login', '/signup', '/'].includes(location.pathname); // 判斷是否為認證頁面

    return (
        <div className="app-container flex h-screen">
            {/* 僅在非認證頁面顯示 Sidebar */}
            {!isAuthPage && <Sidebar />}
            <div className="main-content flex flex-col flex-1">
                {/* 僅在非認證頁面顯示 Header */}
                {!isAuthPage && <Header />}
                <div className="page-content flex-1 p-4">
                    <Routes>
                        <Route path="/" element={<Login />} /> {/* 登錄頁面 */}
                        <Route path="/login" element={<Login />} /> {/* 登錄頁面 */}
                        <Route path="/signup" element={<Signup />} /> {/* 註冊頁面 */}
                        <Route path="/home" element={<Home />} /> {/* 首頁 */}
                        <Route path="/customers" element={<CustomerList />} /> {/* 客戶列表頁面 */}
                        <Route path="/analysis" element={<CustomerAnalysis />} /> {/* 數據分析頁面 */}
                        <Route path="/policy-management" element={<PolicyManagement />} /> {/* 保單管理頁面 */}
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default App;
