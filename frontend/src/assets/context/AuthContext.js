import React, { createContext, useState, useEffect } from 'react';

// 創建一個身份驗證上下文（AuthContext）
const AuthContext = createContext();

// 提供身份驗證的上下文提供者組件
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // 保存當前用戶的狀態

    // 初始化用戶狀態，檢查 localStorage 中的 token
    useEffect(() => {
        const token = localStorage.getItem('token'); // 從 localStorage 中取得 token
        if (token) {
            // 假設我們可以從 token 解碼出用戶信息
            // 或者從 API 請求中驗證並獲取用戶信息
            fetchUserFromToken(token);
        }
    }, []);

    // 從 token 中獲取用戶信息的函數
    const fetchUserFromToken = async (token) => {
        try {
            // 假設有一個 API 可以使用 token 獲取用戶信息
            // 這裡的 `/api/auth/user` 只是示例，請根據實際 API 路徑進行替換
            const response = await fetch('/api/auth/user', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const userData = await response.json();
                setUser(userData); // 設定用戶信息（包含 username）
            } else {
                console.error('無法獲取用戶信息');
                setUser(null);
            }
        } catch (error) {
            console.error('獲取用戶信息失敗:', error);
            setUser(null);
        }
    };

    // 登錄函數
    const login = (userData) => {
        setUser(userData); // 設置當前用戶信息
        localStorage.setItem('token', userData.token); // 將 token 存儲到 localStorage 中
    };

    // 登出函數
    const logout = () => {
        setUser(null); // 清除當前用戶信息
        localStorage.removeItem('token'); // 從 localStorage 中移除 token
    };

    // 返回包含用戶信息和登錄/登出的上下文提供者
    return (
        <AuthContext.Provider value={{ user, setUser, login, logout }}>
            {children} {/* 將子組件作為上下文提供者的一部分渲染 */}
        </AuthContext.Provider>
    );
};

export default AuthContext;
