import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 創建一個身份驗證上下文（AuthContext）
const AuthContext = createContext();

// 提供身份驗證的上下文提供者組件
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // 使用 useState 保存當前用戶的狀態
    const navigate = useNavigate(); // 用於導航的 hook

    // 在組件掛載時運行的副作用，用於檢查當前是否有 token
    useEffect(() => {
        const token = localStorage.getItem('token'); // 從 localStorage 中取得 token
        if (token) {
            // 模擬一個 API 請求來驗證 token 並設置用戶信息
            setUser({ username: '用戶名' }); // 這裡可以是從 token 解碼出的用戶信息
        }
    }, []);

    // 登錄函數
    const login = (userData) => {
        setUser(userData); // 設置當前用戶信息
        localStorage.setItem('token', userData.token); // 將 token 存儲到 localStorage 中
        navigate('/home'); // 導航到首頁
    };

    // 登出函數
    const logout = () => {
        setUser(null); // 清除當前用戶信息
        localStorage.removeItem('token'); // 從 localStorage 中移除 token
        navigate('/login'); // 導航到登錄頁面
    };

    // 返回包含用戶信息和登錄/登出的上下文提供者
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children} {/* 將子組件作為上下文提供者的一部分渲染 */}
        </AuthContext.Provider>
    );
};

export default AuthContext;