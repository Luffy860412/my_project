import React, { useState } from 'react'; // 引入 React 和 useState，用於創建組件和管理狀態
import './AddCustomerModal.css'; // 引入 CSS 文件，設置模態框的樣式

// 定義 AddCustomerModal 組件，接受 onClose 和 onCustomerAdded 作為參數
function AddCustomerModal({ onClose, onCustomerAdded }) {
    // 使用 useState 來管理客戶的各欄位狀態
    const [name, setName] = useState('');         // 保存客戶姓名
    const [phone, setPhone] = useState('');       // 保存客戶電話
    const [gender, setGender] = useState('male'); // 保存客戶性別，默認為 'male'
    const [age, setAge] = useState('');           // 保存客戶年齡
    const [occupation, setOccupation] = useState(''); // 保存客戶職業

    // 處理新增客戶的函數
    const handleAddCustomer = () => {
        // 構建新的客戶對象，包含所有需要的欄位
        const newCustomer = { name, phone, gender, age, occupation };

        // 調用 API 將新客戶保存到後端
        fetch('/api/customers', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCustomer), // 將新客戶對象轉為 JSON 格式發送
        })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Customer added successfully') {
                    onCustomerAdded(data.customer); // 調用 onCustomerAdded，將新增的客戶傳遞到父組件
                    onClose(); // 關閉模態框
                } else {
                    console.error('Failed to add customer:', data.error);
                }
            })
            .catch(error => {
                console.error('Error adding customer:', error);
            });
    };

    // 渲染組件
    return (
        <div className="modal-container">
            <div className="modal-content">
                <h2>新增客戶</h2>

                <label>姓名:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)} // 更新姓名狀態
                />

                <label>電話:</label>
                <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)} // 更新電話狀態
                />

                <label>性別:</label>
                <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)} // 更新性別狀態
                >
                    <option value="male">男</option>
                    <option value="female">女</option>
                    <option value="other">其他</option>
                </select>

                <label>年齡:</label>
                <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)} // 更新年齡狀態
                />

                <label>職業:</label>
                <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)} // 更新職業狀態
                />

                <button onClick={handleAddCustomer}>新增</button> {/* 點擊以新增客戶 */}
                <button onClick={onClose}>取消</button> {/* 點擊以關閉模態框 */}
            </div>
        </div>
    );
}

// 將 AddCustomerModal 組件導出，以便在其他文件中使用
export default AddCustomerModal;
