import React, { useState, useContext } from 'react';
import AuthContext from '../../assets/context/AuthContext';
import Modal from './Modal'; // 引入通用 Modal 組件
import './EditCustomerModal.css';

function EditCustomerModal({ customer, onClose, onCustomerUpdated }) {
    const [name, setName] = useState(customer.name || '');
    const [phone, setPhone] = useState(customer.phone || '');
    const [gender, setGender] = useState(customer.gender || '');
    const [age, setAge] = useState(customer.age || '');
    const [occupation, setOccupation] = useState(customer.occupation || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { user } = useContext(AuthContext);
    const token = user ? user.token : null;

    const handleUpdateCustomer = () => {
        if (!name || !phone || !gender || !age || !occupation) {
            setError('請填寫所有欄位');
            return;
        }

        setLoading(true);
        setError('');

        const updatedCustomer = {
            ...customer,
            name,
            phone,
            gender,
            age,
            occupation,
        };

        if (token) {
            fetch(`/api/customers/${customer.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updatedCustomer),
            })
                .then(response => response.json())
                .then(data => {
                    setLoading(false);
                    if (data.message === 'Customer updated successfully') {
                        onCustomerUpdated(data.customer);
                        onClose();
                    } else {
                        setError('更新客戶失敗，請重試');
                    }
                })
                .catch(error => {
                    console.error('Error updating customer:', error);
                    setError('更新客戶時發生錯誤');
                    setLoading(false);
                });
        } else {
            setError('身份驗證 token 丟失，請重新登錄');
            setLoading(false);
        }
    };

    return (
        <Modal title="編輯客戶" onClose={onClose}>
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

            <button onClick={handleUpdateCustomer} disabled={loading}>
                {loading ? '保存中...' : '保存'}
            </button>
            <button onClick={onClose} disabled={loading}>取消</button>
        </Modal>
    );
}

export default EditCustomerModal;
