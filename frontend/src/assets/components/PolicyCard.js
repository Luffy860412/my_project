import React from 'react'; // 引入 React，用於創建 React 組件
import './PolicyCard.css'; // 引入 CSS 文件，為 PolicyCard 組件設置樣式

// 定義 PolicyCard 函數組件
function PolicyCard({ policy, onEdit, onDelete }) {
    return (
        // 卡片容器，顯示保單信息
        <div className="policy-card">
            {/* 顯示保單名稱 */}
            <h3>{policy.policyName}</h3>

            {/* 顯示客戶名稱 */}
            <p>客戶名稱: {policy.customerName}</p>

            {/* 顯示保費金額 */}
            <p>保費金額: {policy.premiumAmount}</p>

            {/* 顯示保險類型 */}
            <p>保險類型: {policy.insuranceType}</p>

            {/* 顯示購買日期 */}
            <p>購買日期: {policy.purchaseDate}</p>

            {/* 顯示到期日 */}
            <p>到期日: {policy.expiryDate}</p>

            {/* 動作按鈕容器 */}
            <div className="policy-card-actions">
                {/* 編輯按鈕，點擊時調用 onEdit 函數並傳入當前的保單信息 */}
                <button onClick={() => onEdit(policy)} className="edit-button">編輯</button>

                {/* 刪除按鈕，點擊時調用 onDelete 函數並傳入保單的唯一 ID */}
                <button onClick={() => onDelete(policy.id)} className="delete-button">刪除</button>
            </div>
        </div>
    );
}

// 將 PolicyCard 組件導出，以便在其他文件中引入並使用
export default PolicyCard;
