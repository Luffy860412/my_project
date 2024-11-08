import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // 處理登入邏輯
    const handleLogin = async () => {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('登入成功:', data);

                // 存儲 token
                localStorage.setItem('token', data.token);

                // 重設錯誤訊息
                setError(null);

                // 導航至主頁或其他頁面
                navigate('/home');
            } else {
                const errorData = await response.json();
                setError(errorData.error || '登入失敗');
            }
        } catch (error) {
            console.error('登入失敗:', error);
            setError('登入失敗，請檢查您的網路連線');
        }
    };

    return (
        <div className="login-container">
            <h2>登入 OneCRM</h2>

            <div className="login-form">
                {error && <p className="error-message">{error}</p>}

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

                <button onClick={handleLogin} className="login-button">登入</button>

                <Link to="/signup" className="signup-link">註冊</Link>
            </div>
        </div>
    );
}

export default Login;
