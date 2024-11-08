import React from 'react'; // 引入React來使用React組件和JSX語法
import './CustomerCard.css'; // 引入CSS文件來設置客戶卡片的樣式

// 定義 CustomerCard 組件
function CustomerCard({ customer, onEdit, onDelete }) {
    return (
        // 包含客戶信息的卡片容器
        <div className="customer-card">
            {/* 顯示客戶的名字 */}
            <h3>{customer.name}</h3>

            {/* 顯示客戶的電話號碼 */}
            <p>電話: {customer.phone}</p>

            {/* 顯示客戶的狀態 */}
            <p>狀態: {customer.status}</p>

            {/* 動作按鈕容器，包括編輯和刪除功能 */}
            <div className="customer-card-actions">
                {/* 編輯按鈕，點擊後調用 onEdit 函數，並傳遞當前的客戶對象 */}
                <button onClick={() => onEdit(customer)}>編輯</button>

                {/* 刪除按鈕，點擊後調用 onDelete 函數，並傳遞當前客戶的 ID */}
                <button onClick={() => onDelete(customer.id)}>刪除</button>
            </div>
        </div>
    );
}

// 將 CustomerCard 組件導出，以便在其他文件中引入和使用
export default CustomerCard;
