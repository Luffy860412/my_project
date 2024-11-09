import httpClient from './httpClient';

// 獲取客戶列表的函數
export const getCustomers = async () => {
    try {
        // 發送 GET 請求以獲取所有客戶數據
        const response = await httpClient.get('/customers');
        return response.data; // 返回獲取的數據
    } catch (error) {
        // 處理請求錯誤
        console.error('Error fetching customers:', error);
        throw error; // 將錯誤拋出以便於上層函數進行處理
    }
};

// 添加客戶的函數
export const addCustomer = async (customerData) => {
    try {
        // 發送 POST 請求以添加新的客戶數據
        const response = await httpClient.post('/customers', customerData);
        return response.data; // 返回添加成功後的客戶數據
    } catch (error) {
        // 處理請求錯誤
        console.error('Error adding customer:', error);
        throw error; // 將錯誤拋出以便於上層函數進行處理
    }
};

// 編輯客戶的函數
export const editCustomer = async (customerId, customerData) => {
    try {
        // 發送 PUT 請求以更新指定客戶的數據
        const response = await httpClient.put(`/customers/${customerId}`, customerData);
        return response.data; // 返回更新後的客戶數據
    } catch (error) {
        // 處理請求錯誤
        console.error('Error editing customer:', error);
        throw error; // 將錯誤拋出以便於上層函數進行處理
    }
};

// 刪除客戶的函數
export const deleteCustomer = async (customerId) => {
    try {
        // 發送 DELETE 請求以刪除指定的客戶
        await httpClient.delete(`/customers/${customerId}`);
    } catch (error) {
        // 處理請求錯誤
        console.error('Error deleting customer:', error);
        throw error; // 將錯誤拋出以便於上層函數進行處理
    }
};
