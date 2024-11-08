import React, { useState, useEffect } from 'react'; // 引入 useEffect 用於初始化客戶名稱
import './EditPolicyModal.css';

function EditPolicyModal({ policy, onClose, onPolicyUpdated }) {
    // 使用 useState 管理每個表單字段的狀態
    // 初始狀態從傳入的 policy 中取得相應的值
    const [policyName, setPolicyName] = useState(policy.policy_name);
    const [insuranceType, setInsuranceType] = useState(policy.insurance_type);
    const [premiumAmount, setPremiumAmount] = useState(policy.premium_amount);
    const [purchaseDate, setPurchaseDate] = useState(policy.purchase_date);
    const [expiryDate, setExpiryDate] = useState(policy.expiry_date);
    const [policyStatus, setPolicyStatus] = useState(policy.policy_status);
    const [customerName, setCustomerName] = useState(''); // 新增一個狀態來保存客戶姓名

    // 使用 useEffect 在組件掛載時獲取客戶名稱
    useEffect(() => {
        // 發送請求以獲取客戶名稱（假設後端提供 /api/customers/:id 路徑）
        fetch(`/api/customers/${policy.customer_id}`)
            .then(response => response.json())
            .then(data => setCustomerName(data.customer.name || '未知')) // 設置客戶名稱
            .catch(error => console.error('Error fetching customer name:', error));
    }, [policy.customer_id]);

    // 處理保單更新的函數
    const handleUpdatePolicy = () => {
        // 創建更新後的保單對象，將表單中的修改更新到 policy 中
        const updatedPolicy = {
            ...policy,
            policy_name: policyName,
            insurance_type: insuranceType,
            premium_amount: premiumAmount,
            purchase_date: purchaseDate,
            expiry_date: expiryDate,
            policy_status: policyStatus,
        };

        // 調用 API 發送更新的保單數據到後端
        fetch(`/api/policies/${policy.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedPolicy), // 將更新的保單對象轉為 JSON 格式發送
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Policy updated successfully') {
                    onPolicyUpdated(data.policy); // 通知父組件已更新保單
                    onClose(); // 關閉模態框
                } else {
                    console.error('Failed to update policy:', data.error);
                }
            })
            .catch(error => {
                console.error('Error updating policy:', error);
            });
    };

    return (
        <div className="modal-container">
            <div className="modal-content">
                <h2>編輯保單</h2>

                {/* 客戶姓名欄位，顯示已選定的客戶名稱（唯讀） */}
                <label>客戶姓名:</label>
                <input type="text" value={customerName} readOnly className="read-only-field" /> {/* 顯示客戶姓名而非客戶ID */}

                {/* 保單名稱輸入框 */}
                <label>保單名稱:</label>
                <input type="text" value={policyName} onChange={(e) => setPolicyName(e.target.value)} />

                {/* 保險類型選擇框 */}
                <label>保險類型:</label>
                <select value={insuranceType} onChange={(e) => setInsuranceType(e.target.value)}>
                    <option value="health">健康險</option>
                    <option value="life">人壽險</option>
                    <option value="accident">意外險</option>
                </select>

                {/* 保費金額輸入框 */}
                <label>保費金額:</label>
                <input type="number" value={premiumAmount} onChange={(e) => setPremiumAmount(e.target.value)} />

                {/* 購買日期輸入框 */}
                <label>購買日期:</label>
                <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />

                {/* 到期日輸入框 */}
                <label>到期日:</label>
                <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />

                {/* 保單狀態選擇框 */}
                <label>保單狀態:</label>
                <select value={policyStatus} onChange={(e) => setPolicyStatus(e.target.value)}>
                    <option value="active">有效</option>
                    <option value="expired">已過期</option>
                </select>

                {/* 保存和取消按鈕 */}
                <button onClick={handleUpdatePolicy}>保存</button>
                <button onClick={onClose}>取消</button>
            </div>
        </div>
    );
}

export default EditPolicyModal;
