import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../../assets/context/AuthContext';
import Modal from './Modal'; // 引入通用 Modal 組件
import './EditPolicyModal.css';

function EditPolicyModal({ policy, onClose, onPolicyUpdated }) {
    const [policyName, setPolicyName] = useState(policy.policy_name);
    const [insuranceType, setInsuranceType] = useState(policy.insurance_type);
    const [premiumAmount, setPremiumAmount] = useState(policy.premium_amount);
    const [purchaseDate, setPurchaseDate] = useState(policy.purchase_date);
    const [expiryDate, setExpiryDate] = useState(policy.expiry_date);
    const [policyStatus, setPolicyStatus] = useState(policy.policy_status);
    const [customerName, setCustomerName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { user } = useContext(AuthContext);
    const token = user ? user.token : null;

    useEffect(() => {
        if (token) {
            fetch(`/api/customers/${policy.customer_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
                .then(response => {
                    if (!response.ok) throw new Error('Failed to fetch customer name');
                    return response.json();
                })
                .then(data => setCustomerName(data.customer.name || '未知'))
                .catch(error => console.error('Error fetching customer name:', error));
        }
    }, [policy.customer_id, token]);

    const handleUpdatePolicy = async () => {
        const updatedPolicy = {
            ...policy,
            policy_name: policyName,
            insurance_type: insuranceType,
            premium_amount: premiumAmount,
            purchase_date: purchaseDate,
            expiry_date: expiryDate,
            policy_status: policyStatus,
        };

        setLoading(true);
        setError('');

        if (token) {
            try {
                const response = await fetch(`/api/policies/${policy.id}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedPolicy),
                });

                const data = await response.json();
                setLoading(false);
                if (response.ok) {
                    onPolicyUpdated(data.policy);
                    onClose();
                } else {
                    setError('更新保單失敗，請重試');
                }
            } catch (error) {
                console.error('Error updating policy:', error);
                setError('更新保單時發生錯誤');
                setLoading(false);
            }
        } else {
            setError('身份驗證 token 丟失，請重新登錄');
            setLoading(false);
        }
    };

    return (
        <Modal title="編輯保單" onClose={onClose}>
            {error && <p className="error-message">{error}</p>}

            <label>客戶姓名:</label>
            <input type="text" value={customerName} readOnly className="read-only-field" />

            <label>保單名稱:</label>
            <input type="text" value={policyName} onChange={(e) => setPolicyName(e.target.value)} />

            <label>保險類型:</label>
            <select value={insuranceType} onChange={(e) => setInsuranceType(e.target.value)}>
                <option value="health">健康險</option>
                <option value="life">人壽險</option>
                <option value="accident">意外險</option>
            </select>

            <label>保費金額:</label>
            <input type="number" value={premiumAmount} onChange={(e) => setPremiumAmount(e.target.value)} />

            <label>購買日期:</label>
            <input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />

            <label>到期日:</label>
            <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />

            <label>保單狀態:</label>
            <select value={policyStatus} onChange={(e) => setPolicyStatus(e.target.value)}>
                <option value="active">有效</option>
                <option value="expired">已過期</option>
            </select>

            <button onClick={handleUpdatePolicy} disabled={loading}>
                {loading ? '保存中...' : '保存'}
            </button>
            <button onClick={onClose} disabled={loading}>取消</button>
        </Modal>
    );
}

export default EditPolicyModal;
