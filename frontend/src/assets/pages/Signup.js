import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    // 註冊處理函數
    const handleSignup = async () => {
        // 檢查密碼一致性
        if (password !== confirmPassword) {
            setError('密碼不一致'); // 設置錯誤信息
            return;
        }

        try {
            // 向後端發送註冊請求
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('註冊成功，將跳轉至登入頁面'); // 註冊成功時顯示提示
                setError(null); // 清除任何之前的錯誤

                // 設置延時跳轉到登入頁面
                setTimeout(() => navigate('/'), 2000);
            } else {
                setError(data.error || '註冊失敗，請稍後再試'); // 顯示錯誤信息
            }
        } catch (error) {
            setError('註冊過程中出錯，請檢查您的網絡或稍後再試'); // 處理 API 調用過程中的錯誤
        }
    };

    return (
        <div className="signup-container">
            <h2>註冊新帳戶</h2>
            <div className="signup-form">
                {error && <p className="error-message">{error}</p>} {/* 顯示錯誤信息 */}
                {successMessage && <p className="success-message">{successMessage}</p>} {/* 顯示成功信息 */}

                <label>用戶名:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoFocus
                />

                <label>密碼:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <label>確認密碼:</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button onClick={handleSignup} className="signup-button">註冊</button>
                <Link to="/" className="login-link">已有帳戶？登入</Link>
            </div>
        </div>
    );
}

export default Signup;
