import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../assets/context/AuthContext';
import './Home.css';

function Home() {
    const { user, setUser } = useContext(AuthContext); // 從 AuthContext 中獲取 user 和 setUser
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // 添加 loading 狀態

    console.log("Current user state:", user); // 用於調試

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
                console.log("Fetched user data:", userData); // 用於調試
                // 將 token 添加到 userData 中，確保 user 狀態包含 token
                setUser({ ...userData, token }); // 使用 setUser 設置 user 狀態
            } else {
                console.error('無法獲取用戶信息');
                setUser(null);
            }
        } catch (error) {
            console.error('獲取用戶信息失敗:', error);
            setUser(null);
        } finally {
            setLoading(false); // 無論成功或失敗，結束 loading 狀態
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUserFromToken(token);
        } else {
            navigate('/login'); // 沒有 token 時重定向到登入頁
        }
    }, [navigate]);

    // 等待 `user` 加載完成後再渲染
    if (loading) {
        return <div>載入中...</div>; // 顯示加載中狀態，直到 `user` 加載完成
    }

    if (!user) {
        // 如果無法獲取 user 信息，則導航到登入頁或顯示錯誤訊息
        navigate('/login');
        return null;
    }

    return (
        <div className="home-container">
            <h1>歡迎來到 OneCRM, {user.username}</h1>
            <p>請選擇下列功能來管理您的客戶資料</p>

            <div className="home-cards">
                <Link to="/customers" className="home-card">客戶列表</Link>
                <Link to="/analysis" className="home-card">數據分析</Link>
                <Link to="/policy-management" className="home-card">保單管理</Link>
            </div>
        </div>
    );
}

export default Home;
