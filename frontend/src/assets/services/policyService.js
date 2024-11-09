import httpClient from './httpClient';

// 獲取保單列表的函數，並包括每個保單的客戶名稱
export const getPolicies = async () => {
    try {
        // 發送 GET 請求以獲取所有保單數據
        const response = await httpClient.get('/api/policies'); // 注意路由前綴
        const policies = response.data.policies;

        // 获取每个保单的客户名称并附加到数据
        const policiesWithCustomerName = await Promise.all(
            policies.map(async (policy) => {
                try {
                    const customerResponse = await httpClient.get(`/api/customers/${policy.customer_id}`);
                    const customerData = customerResponse.data;
                    return {
                        ...policy,
                        customerName: customerData.customer.name || '未知',
                    };
                } catch (customerError) {
                    console.error(`Error fetching customer for policy ${policy.id}:`, customerError);
                    return { ...policy, customerName: '未知' };
                }
            })
        );

        return policiesWithCustomerName; // 返回包括客户名称的保单数据
    } catch (error) {
        console.error('Error fetching policies:', error);
        throw error; // 将错误抛出以便上层处理
    }
};

// 添加保單的函數
export const addPolicy = async (policyData) => {
    try {
        // 發送 POST 請求以添加新的保單數據
        const response = await httpClient.post('/api/policies', policyData); // 注意路由前綴
        return response.data.policy; // 返回添加成功後的保單數據
    } catch (error) {
        console.error('Error adding policy:', error);
        throw error; // 將錯誤拋出以便於上層函數進行處理
    }
};

// 編輯保單的函數
export const editPolicy = async (policyId, policyData) => {
    try {
        // 發送 PUT 請求以更新指定保單的數據
        const response = await httpClient.put(`/api/policies/${policyId}`, policyData); // 注意路由前綴
        return response.data.policy; // 返回更新後的保單數據
    } catch (error) {
        console.error('Error editing policy:', error);
        throw error; // 將錯誤拋出以便於上層函數進行處理
    }
};

// 刪除保單的函數
export const deletePolicy = async (policyId) => {
    try {
        // 發送 DELETE 請求以刪除指定的保單
        await httpClient.delete(`/api/policies/${policyId}`); // 注意路由前綴
    } catch (error) {
        console.error('Error deleting policy:', error);
        throw error; // 將錯誤拋出以便於上層函數進行處理
    }
};
