import React from 'react';
import './CustomerCard.css';

function CustomerCard({ customer, onEdit, onDelete }) {
    // 處理刪除按鈕的點擊事件，添加確認提示
    const handleDelete = () => {
        if (window.confirm(`確定要刪除 ${customer.name} 的資料嗎？`)) {
            onDelete(customer.id);
        }
    };

    return (
        <div className={`customer-card ${customer.status === 'active' ? 'active' : 'inactive'}`}>
            <h3>{customer.name}</h3>
            <p>電話: {customer.phone}</p>
            <p>狀態: {customer.status}</p>
            <p>性別: {customer.gender}</p>
            <p>年齡: {customer.age}</p>
            <p>職業: {customer.occupation}</p>

            <div className="customer-card-actions">
                <button onClick={() => onEdit(customer)}>編輯</button>
                <button onClick={handleDelete}>刪除</button>
            </div>
        </div>
    );
}

export default CustomerCard;
