import React, { useState } from 'react'; // 引入 React 及 useState，用於創建組件和管理本地狀態
import './EditCustomerModal.css'; // 引入 CSS 文件，用於設置模態框的樣式

// 定義 EditCustomerModal 函數組件
function EditCustomerModal({ customer, onClose, onCustomerUpdated }) {
    // 使用 useState 初始化客戶的各欄位狀態
    const [name, setName] = useState(customer.name);          // 保存客戶姓名
    const [phone, setPhone] = useState(customer.phone);       // 保存客戶電話
    const [gender, setGender] = useState(customer.gender);    // 保存客戶性別
    const [age, setAge] = useState(customer.age);             // 保存客戶年齡
    const [occupation, setOccupation] = useState(customer.occupation); // 保存客戶職業

    // 處理更新客戶的函數
    const handleUpdateCustomer = () => {
        // 創建更新的客戶對象，包含所有欄位
        const updatedCustomer = {
            ...customer,
            name,
            phone,
            gender,
            age,
            occupation
        };

        // 調用 API 將更新的客戶數據發送到後端
        fetch(`/api/customers/${customer.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedCustomer), // 將更新的客戶對象轉為 JSON 格式發送
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Customer updated successfully') {
                    onCustomerUpdated(data.customer); // 調用 onCustomerUpdated，將更新後的數據傳遞到父組件
                    onClose(); // 關閉模態框
                } else {
                    console.error('Failed to update customer:', data.error);
                }
            })
            .catch(error => {
                console.error('Error updating customer:', error);
            });
    };

    // 組件的渲染部分
    return (
        <div className="modal-container">
            <div className="modal-content">
                <h2>編輯客戶</h2>

                {/* 客戶姓名輸入框 */}
                <label>姓名:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)} // 更新姓名狀態
                />

                {/* 客戶電話輸入框 */}
                <label>電話:</label>
                <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)} // 更新電話狀態
                />

                {/* 客戶性別選擇框 */}
                <label>性別:</label>
                <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)} // 更新性別狀態
                >
                    <option value="male">男</option>
                    <option value="female">女</option>
                    <option value="other">其他</option>
                </select>

                {/* 客戶年齡輸入框 */}
                <label>年齡:</label>
                <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)} // 更新年齡狀態
                />

                {/* 客戶職業輸入框 */}
                <label>職業:</label>
                <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)} // 更新職業狀態
                />

                {/* 保存按鈕，點擊時調用 handleUpdateCustomer 函數以更新客戶數據 */}
                <button onClick={handleUpdateCustomer}>保存</button>

                {/* 取消按鈕，點擊時調用 onClose 函數以關閉模態框 */}
                <button onClick={onClose}>取消</button>
            </div>
        </div>
    );
}

// 將 EditCustomerModal 組件導出，以便在其他文件中使用
export default EditCustomerModal;
