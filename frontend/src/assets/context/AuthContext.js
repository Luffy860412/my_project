import React, { createContext, useState, useEffect } from 'react';

// 創建一個身份驗證上下文（AuthContext）
const AuthContext = createContext();

// 提供身份驗證的上下文提供者組件
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // 保存當前用戶的狀態
    const [loading, setLoading] = useState(true); // 添加 loading 狀態

    // 初始化用戶狀態，檢查 localStorage 中的 token
    useEffect(() => {
        const token = localStorage.getItem('token'); // 從 localStorage 中取得 token
        if (token) {
            fetchUserFromToken(token); // 使用 token 獲取用戶信息
        } else {
            setLoading(false); // 如果沒有 token，直接結束 loading 狀態
        }
    }, []);

    // 從 token 中獲取用戶信息的函數
    const fetchUserFromToken = async (token) => {
        try {
            const response = await fetch('/api/auth/user', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}` // 在 Authorization 標頭中傳遞 token
                }
            });
            if (response.ok) {
                const userData = await response.json();
                // 將 token 添加到 userData 中，確保 user 狀態包含 token
                setUser({ ...userData, token }); // userData 包含 token，將其設置為 user 狀態
            } else {
                console.error('無法獲取用戶信息');
                setUser(null); // 若 token 無效，則設置 user 為 null
            }
        } catch (error) {
            console.error('獲取用戶信息失敗:', error);
            setUser(null);
        } finally {
            setLoading(false); // 無論成功或失敗，結束 loading 狀態
        }
    };

    // 登錄函數
    const login = (userData) => {
        setUser(userData); // 設置當前用戶信息，userData 包含用戶的所有信息，包括 token
        localStorage.setItem('token', userData.token); // 將 token 存儲到 localStorage 中，這樣即使刷新頁面 token 也能保留
    };

    // 登出函數
    const logout = () => {
        setUser(null); // 清除當前用戶信息
        localStorage.removeItem('token'); // 從 localStorage 中移除 token
    };

    // 返回包含用戶信息和登錄/登出的上下文提供者
    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
            {children} {/* 將子組件作為上下文提供者的一部分渲染 */}
        </AuthContext.Provider>
    );
};

export default AuthContext;
