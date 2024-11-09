import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../../assets/context/AuthContext';
import Modal from './Modal'; // 引入通用 Modal 組件
import './AddPolicyModal.css';

function AddPolicyModal({ onClose, onPolicyAdded }) {
    const [customerId, setCustomerId] = useState('');
    const [policyName, setPolicyName] = useState('');
    const [insuranceType, setInsuranceType] = useState('health');
    const [premiumAmount, setPremiumAmount] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [policyStatus, setPolicyStatus] = useState('active');
    const [customers, setCustomers] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const { user, loading: authLoading } = useContext(AuthContext); // 從 AuthContext 中獲取 user
    const token = user ? user.token : null;

    useEffect(() => {
        if (!authLoading && token) { // 等待 authLoading 為 false 並且 token 存在
            fetch('/api/customers', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .then(data => setCustomers(data.customers || []))
                .catch(error => {
                    console.error('Error fetching customers:', error);
                    setErrorMessage('無法加載客戶列表');
                });
        } else if (!authLoading) {
            console.error('未找到 token');
            setErrorMessage('未找到身份驗證 token');
        }
    }, [token, authLoading]);

    const handleAddPolicy = () => {
        if (!customerId || !policyName || !premiumAmount || !purchaseDate || !expiryDate) {
            setErrorMessage('請填寫所有必要欄位');
            return;
        }

        setLoading(true);
        const newPolicy = {
            customer_id: customerId,
            policy_name: policyName,
            insurance_type: insuranceType,
            premium_amount: premiumAmount,
            purchase_date: purchaseDate,
            expiry_date: expiryDate,
            policy_status: policyStatus,
        };

        if (token) {
            fetch('/api/policies', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newPolicy),
            })
                .then(response => response.json())
                .then(data => {
                    setLoading(false);
                    if (data.message === 'Policy added successfully') {
                        onPolicyAdded(data.policy);
                        onClose();
                    } else {
                        setErrorMessage('新增保單失敗，請重試');
                        console.error('Failed to add policy:', data.error);
                    }
                })
                .catch(error => {
                    setLoading(false);
                    setErrorMessage('新增保單過程中發生錯誤');
                    console.error('Error adding policy:', error);
                });
        } else {
            setLoading(false);
            setErrorMessage('無法新增保單，未找到身份驗證 token');
        }
    };

    return (
        <Modal title="新增保單" onClose={onClose}>
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            <label>客戶姓名:</label>
            <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                <option value="">選擇客戶</option>
                {customers.map(customer => (
                    <option key={customer.id} value={customer.id}>
                        {customer.name}
                    </option>
                ))}
            </select>

            <label>保單名稱:</label>
            <input
                type="text"
                value={policyName}
                onChange={(e) => setPolicyName(e.target.value)}
            />

            <label>保險類型:</label>
            <select value={insuranceType} onChange={(e) => setInsuranceType(e.target.value)}>
                <option value="health">健康險</option>
                <option value="life">人壽險</option>
                <option value="accident">意外險</option>
            </select>

            <label>保費金額:</label>
            <input
                type="number"
                value={premiumAmount}
                onChange={(e) => setPremiumAmount(e.target.value)}
            />

            <label>購買日期:</label>
            <input
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
            />

            <label>到期日:</label>
            <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
            />

            <label>保單狀態:</label>
            <select value={policyStatus} onChange={(e) => setPolicyStatus(e.target.value)}>
                <option value="active">有效</option>
                <option value="expired">已過期</option>
            </select>

            <button onClick={handleAddPolicy} disabled={loading}>
                {loading ? '添加中...' : '新增'}
            </button>
            <button onClick={onClose} disabled={loading}>取消</button>
        </Modal>
    );
}

export default AddPolicyModal;
