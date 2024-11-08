import React, { useState, useEffect } from 'react';
import './CustomerList.css';
import AddCustomerModal from '../modals/AddCustomerModal';
import EditCustomerModal from '../modals/EditCustomerModal';

function CustomerList() {
    const [customers, setCustomers] = useState([]);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editCustomer, setEditCustomer] = useState(null);

    useEffect(() => {
        // 獲取 token
        const token = localStorage.getItem('token');

        fetch('/api/customers', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 添加 Authorization Header
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => setCustomers(data.customers || []))
            .catch(error => console.error('Error fetching customers:', error));
    }, []);

    const handleAddCustomer = (customer) => {
        setCustomers([...customers, customer]);
        setAddModalOpen(false);
    };

    const handleEditCustomer = (updatedCustomer) => {
        setCustomers(customers.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
        setEditCustomer(null);
    };

    const handleDeleteCustomer = (id) => {
        // 獲取 token
        const token = localStorage.getItem('token');

        fetch(`/api/customers/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}` // 添加 Authorization Header
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

            {isAddModalOpen && (
                <AddCustomerModal onClose={() => setAddModalOpen(false)} onCustomerAdded={handleAddCustomer} />
            )}

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
