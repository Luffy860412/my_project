import axios from 'axios';

// 創建一個 httpClient，基於 axios 來與後端 API 進行交互
const httpClient = axios.create({
    baseURL: 'http://localhost:5000/api', // 後端 API 的基礎 URL
    timeout: 5000, // 設置請求超時時間為 5000 毫秒
    headers: {
        'Content-Type': 'application/json', // 設置請求的內容類型為 JSON
    },
});

// 添加請求攔截器，用於在發送請求之前做一些處理
httpClient.interceptors.request.use(
    (config) => {
        // 在發送請求之前附加 token，如果存在的話
        const token = localStorage.getItem('token'); // 從 localStorage 中取得 token
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`; // 將 token 加入到請求頭的 Authorization 欄位中
        }
        return config; // 返回修改後的配置
    },
    (error) => {
        // 如果請求出現錯誤，則拒絕 Promise
        return Promise.reject(error);
    }
);

// 導出 httpClient，以便在其他文件中使用
export default httpClient;
