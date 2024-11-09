import React, { useState, useContext } from 'react';
import AuthContext from '../../assets/context/AuthContext';
import Modal from './Modal'; // 引入通用 Modal 組件
import './AddCustomerModal.css';

function AddCustomerModal({ onClose, onCustomerAdded }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [gender, setGender] = useState('male');
    const [age, setAge] = useState('');
    const [occupation, setOccupation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { user } = useContext(AuthContext);
    const token = user ? user.token : null;

    const handleAddCustomer = () => {
        if (!name || !phone || !age || !occupation) {
            setError('所有字段均為必填項');
            return;
        }

        setLoading(true);
        setError('');

        const newCustomer = { name, phone, gender, age, occupation };

        if (token) {
            fetch('/api/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newCustomer),
            })
                .then(response => response.json())
                .then(data => {
                    setLoading(false);
                    if (data.message === 'Customer added successfully') {
                        onCustomerAdded(data.customer);
                        onClose();
                    } else {
                        setError('新增客戶失敗，請重試');
                        console.error('Failed to add customer:', data.error);
                    }
                })
                .catch(error => {
                    setLoading(false);
                    setError('新增客戶時發生錯誤，請重試');
                    console.error('Error adding customer:', error);
                });
        } else {
            setError('身份驗證 token 丟失，請重新登錄');
            setLoading(false);
        }
    };

    return (
        <Modal title="新增客戶" onClose={onClose}>
            {/* 表單內容區域 */}
            {error && <p className="error-message">{error}</p>}

            <label>姓名:</label>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <label>電話:</label>
            <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />

            <label>性別:</label>
            <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
            >
                <option value="male">男</option>
                <option value="female">女</option>
                <option value="other">其他</option>
            </select>

            <label>年齡:</label>
            <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
            />

            <label>職業:</label>
            <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
            />

            <button onClick={handleAddCustomer} disabled={loading}>
                {loading ? '添加中...' : '新增'}
            </button>
            <button onClick={onClose} disabled={loading}>取消</button>
        </Modal>
    );
}

export default AddCustomerModal;
