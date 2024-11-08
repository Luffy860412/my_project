import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../assets/context/AuthContext';
import './CustomerList.css';
import AddCustomerModal from '../modals/AddCustomerModal';
import EditCustomerModal from '../modals/EditCustomerModal';

function CustomerList() {
    const [customers, setCustomers] = useState([]);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editCustomer, setEditCustomer] = useState(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (user && user.token) {
            fetchCustomers(user.token);
        }
    }, [user, navigate]);

    // 從 API 獲取客戶列表的函數
    const fetchCustomers = async (token) => {
        try {
            const response = await fetch('/api/customers', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                if (response.status === 401) {
                    alert('您的會話已過期，請重新登錄');
                    navigate('/login');
                } else {
                    throw new Error('Network response was not ok');
                }
            }
            const data = await response.json();
            setCustomers(data.customers || []);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    // 處理添加客戶
    const handleAddCustomer = (customer) => {
        setCustomers([...customers, customer]);
        setAddModalOpen(false);
    };

    // 處理更新客戶
    const handleEditCustomer = (updatedCustomer) => {
        setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
        setEditCustomer(null);
    };

    // 處理刪除客戶
    const handleDeleteCustomer = (id) => {
        const token = user ? user.token : null;
        if (window.confirm("確定要刪除此客戶嗎？")) {
            fetch(`/api/customers/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    if (response.ok) {
                        setCustomers(customers.filter(c => c.id !== id));
                    } else {
                        console.error('Failed to delete customer');
                    }
                })
                .catch(error => console.error('Error deleting customer:', error));
        }
    };

    return (
        <div className="customer-list-container">
            <h2>客戶列表</h2>

            <button onClick={() => setAddModalOpen(true)} className="add-customer-button">新增客戶</button>

            <table className="customer-table">
                <thead>
                <tr>
                    <th>姓名</th>
                    <th>性別</th>
                    <th>年齡</th>
                    <th>職業</th>
                    <th>聯繫電話</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                {customers.map((customer) => (
                    <tr key={customer.id}>
                        <td>{customer.name}</td>
                        <td>{customer.gender}</td>
                        <td>{customer.age}</td>
                        <td>{customer.occupation}</td>
                        <td>{customer.phone}</td>
                        <td>
                            <button onClick={() => setEditCustomer(customer)}>編輯</button>
                            <button onClick={() => handleDeleteCustomer(customer.id)}>刪除</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* 新增客戶模態框 */}
            {isAddModalOpen && (
                <AddCustomerModal onClose={() => setAddModalOpen(false)} onCustomerAdded={handleAddCustomer} />
            )}

            {/* 編輯客戶模態框 */}
            {editCustomer && (
                <EditCustomerModal
                    customer={editCustomer}
                    onClose={() => setEditCustomer(null)}
                    onCustomerUpdated={handleEditCustomer}
                />
            )}
        </div>
    );
}

export default CustomerList;
