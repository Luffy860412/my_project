// 驗證用戶名的函數
export const validateUsername = (username) => {
    // 檢查用戶名是否為空或只包含空格
    if (!username || username.trim() === '') {
        return '用戶名不能為空'; // 返回錯誤提示
    }
    // 檢查用戶名的長度是否小於 3 個字符
    if (username.length < 3) {
        return '用戶名必須至少包含3個字符'; // 返回錯誤提示
    }
    // 驗證通過，返回 null
    return null;
};

// 驗證密碼的函數
export const validatePassword = (password) => {
    // 檢查密碼是否為空或只包含空格
    if (!password || password.trim() === '') {
        return '密碼不能為空'; // 返回錯誤提示
    }
    // 檢查密碼的長度是否小於 6 個字符
    if (password.length < 6) {
        return '密碼必須至少包含6個字符'; // 返回錯誤提示
    }
    // 驗證通過，返回 null
    return null;
};

// 驗證確認密碼的函數
export const validateConfirmPassword = (password, confirmPassword) => {
    // 檢查兩次輸入的密碼是否一致
    if (password !== confirmPassword) {
        return '兩次輸入的密碼不一致'; // 返回錯誤提示
    }
    // 驗證通過，返回 null
    return null;
};
