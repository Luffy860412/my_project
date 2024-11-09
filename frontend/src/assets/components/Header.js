import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import AuthContext from '../../assets/context/AuthContext'; // 引入 AuthContext
import { useContext } from 'react';

function Header() {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext); // 使用 useContext 取得 user 和 logout 函數

    // 登出處理函數
    const handleLogout = () => {
        // 清除用戶認證信息，例如 localStorage.removeItem("userToken");
        logout(); // 調用 AuthContext 中的 logout 函數
        navigate('/');
    };

    return (
        <div className="header-container w-full shadow-lg"> {/* 設置為 w-full */}
            <header className="w-full h-[80px] text-white flex justify-center items-center relative">
                {/* 中央網站標題 */}
                <h1 className="font-title text-4xl text-center absolute left-1/2 transform -translate-x-1/2">
                    OneCRM - 客戶關係管理系統
                </h1>

                {/* 用戶信息與登出按鈕 */}
                <div className="ml-auto px-6 flex items-center">
                    <span className="mr-4">歡迎，{user?.username || 'Guest'}</span>
                    <button onClick={handleLogout} className="text-white hover:underline">
                        登出
                    </button>
                </div>
            </header>
        </div>
    );
}

export default Header;
