import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../assets/context/AuthContext';
import './Home.css';

function Home() {
    const { user, setUser } = useContext(AuthContext); // 從 AuthContext 中獲取 user 和 setUser
    const navigate = useNavigate();

    console.log("Current user state:", user); // 用於調試

    const fetchUserFromToken = async (token) => {
        try {
            const response = await fetch('/api/auth/user', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const userData = await response.json();
                console.log("Fetched user data:", userData); // 用於調試
                setUser(userData); // 使用 setUser 設置 user 狀態
            } else {
                console.error('無法獲取用戶信息');
                setUser(null);
            }
        } catch (error) {
            console.error('獲取用戶信息失敗:', error);
            setUser(null);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchUserFromToken(token);
        } else {
            navigate('/login');
        }
    }, [navigate]);

    // 等待 `user` 加載完成後再渲染
    if (!user || !user.username) {
        return <div>載入中...</div>;
    }

    return (
        <div className="home-container">
            <h1>歡迎來到 OneCRM, {user.username}</h1>
            <p>請選擇下列功能來管理您的客戶資料</p>

            <div className="home-cards">
                <Link to="/customers" className="home-card">客戶列表</Link>
                <Link to="/customer-analysis" className="home-card">客戶分析</Link>
                <Link to="/policy-management" className="home-card">保單管理</Link>
            </div>
        </div>
    );
}

export default Home;
