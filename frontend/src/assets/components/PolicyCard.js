import React from 'react';
import './PolicyCard.css';

function PolicyCard({ policy, onEdit, onDelete }) {
    const handleDelete = () => {
        if (window.confirm(`確定要刪除保單 "${policy.policyName}" 嗎？`)) {
            onDelete(policy.id);
        }
    };

    return (
        <div className="policy-card">
            <h3>{policy.policyName}</h3>

            <p>客戶名稱: {policy.customerName}</p>
            <p>保費金額: {policy.premiumAmount}</p>
            <p>保險類型: {policy.insuranceType}</p>
            <p>購買日期: {policy.purchaseDate}</p>
            <p>到期日: {policy.expiryDate}</p>

            <div className="policy-card-actions">
                <button onClick={() => onEdit(policy)} className="edit-button">編輯</button>
                <button onClick={handleDelete} className="delete-button">刪除</button>
            </div>
        </div>
    );
}

export default PolicyCard;
