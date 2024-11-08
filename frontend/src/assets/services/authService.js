import httpClient from './httpClient';

// 登錄的函數
export const login = async (username, password) => {
    try {
        // 發送 POST 請求進行登錄，並傳遞用戶名和密碼
        const response = await httpClient.post('/auth/login', { username, password });
        if (response.data.token) {
            // 如果響應中有 token，將其存儲到 localStorage 中
            localStorage.setItem('token', response.data.token);
        }
        return response.data; // 返回登錄的響應數據
    } catch (error) {
        // 處理登錄過程中的錯誤
        console.error('Error logging in:', error);
        throw error; // 將錯誤拋出以便於上層函數進行處理
    }
};

// 註冊的函數
export const signup = async (username, password) => {
    try {
        // 發送 POST 請求進行用戶註冊，並傳遞用戶名和密碼
        const response = await httpClient.post('/auth/signup', { username, password });
        return response.data; // 返回註冊的響應數據
    } catch (error) {
        // 處理註冊過程中的錯誤
        console.error('Error signing up:', error);
        throw error; // 將錯誤拋出以便於上層函數進行處理
    }
};

// 登出的函數
export const logout = () => {
    // 從 localStorage 中移除 token
    localStorage.removeItem('token');
};
