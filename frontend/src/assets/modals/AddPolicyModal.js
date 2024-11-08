import React, { useState, useEffect } from 'react'; // 引入 React, useState, useEffect，用於狀態管理和組件掛載
import './AddPolicyModal.css'; // 引入樣式文件

// 定義 AddPolicyModal 函數組件
function AddPolicyModal({ onClose, onPolicyAdded }) {
    // 使用 useState 來管理保單各字段的狀態
    const [customerId, setCustomerId] = useState(''); // 保存選擇的客戶 ID
    const [policyName, setPolicyName] = useState(''); // 保存保單名稱的狀態
    const [insuranceType, setInsuranceType] = useState('health'); // 保存保險類型的狀態
    const [premiumAmount, setPremiumAmount] = useState(''); // 保存保費金額的狀態
    const [purchaseDate, setPurchaseDate] = useState(''); // 保存購買日期的狀態
    const [expiryDate, setExpiryDate] = useState(''); // 保存到期日的狀態
    const [policyStatus, setPolicyStatus] = useState('active'); // 保存保單狀態，默認為 'active'
    const [customers, setCustomers] = useState([]); // 保存從後端獲取的客戶列表

    // 使用 useEffect 獲取客戶列表，並在模態框掛載時從後端加載
    useEffect(() => {
        fetch('/api/customers')
            .then(response => response.json())
            .then(data => setCustomers(data.customers || [])) // 將獲取到的客戶列表設置到狀態
            .catch(error => console.error('Error fetching customers:', error));
    }, []);

    // 處理新增保單的函數
    const handleAddPolicy = () => {
        // 創建新保單對象，包含所有需要的欄位
        const newPolicy = {
            customer_id: customerId,
            policy_name: policyName,
            insurance_type: insuranceType,
            premium_amount: premiumAmount,
            purchase_date: purchaseDate,
            expiry_date: expiryDate,
            policy_status: policyStatus,
        };

        // 調用 API 將新保單保存到後端
        fetch('/api/policies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPolicy), // 將新保單對象轉為 JSON 格式發送
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Policy added successfully') {
                    onPolicyAdded(data.policy); // 通知父組件已新增保單
                    onClose(); // 關閉模態框
                } else {
                    console.error('Failed to add policy:', data.error);
                }
            })
            .catch(error => {
                console.error('Error adding policy:', error);
            });
    };

    // 組件的渲染部分
    return (
        <div className="modal-container">
            <div className="modal-content">
                <h2>新增保單</h2>

                {/* 客戶選擇下拉框（由客戶 ID 改為客戶姓名選項） */}
                <label>客戶姓名:</label>
                <select
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)} // 選擇框改變時，更新客戶 ID
                >
                    <option value="">選擇客戶</option>
                    {customers.map(customer => (
                        <option key={customer.id} value={customer.id}>
                            {customer.name}
                        </option>
                    ))}
                </select>

                {/* 保單名稱輸入框 */}
                <label>保單名稱:</label>
                <input
                    type="text"
                    value={policyName}
                    onChange={(e) => setPolicyName(e.target.value)}
                />

                {/* 保險類型選擇框 */}
                <label>保險類型:</label>
                <select
                    value={insuranceType}
                    onChange={(e) => setInsuranceType(e.target.value)}
                >
                    <option value="health">健康險</option>
                    <option value="life">人壽險</option>
                    <option value="accident">意外險</option>
                </select>

                {/* 保費金額輸入框 */}
                <label>保費金額:</label>
                <input
                    type="number"
                    value={premiumAmount}
                    onChange={(e) => setPremiumAmount(e.target.value)}
                />

                {/* 購買日期選擇框 */}
                <label>購買日期:</label>
                <input
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                />

                {/* 到期日選擇框 */}
                <label>到期日:</label>
                <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                />

                {/* 保單狀態選擇框 */}
                <label>保單狀態:</label>
                <select
                    value={policyStatus}
                    onChange={(e) => setPolicyStatus(e.target.value)}
                >
                    <option value="active">有效</option>
                    <option value="expired">已過期</option>
                </select>

                {/* 新增按鈕，點擊時調用 handleAddPolicy 函數以新增保單 */}
                <button onClick={handleAddPolicy}>新增</button>

                {/* 取消按鈕，點擊時調用 onClose 函數以關閉模態框 */}
                <button onClick={onClose}>取消</button>
            </div>
        </div>
    );
}

// 將 AddPolicyModal 組件導出，以便在其他文件中使用
export default AddPolicyModal;
