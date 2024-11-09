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
    const { user, loading } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        // 等到 loading 結束後再檢查 user 狀態
        if (!loading) {
            if (!user) {
                navigate('/login'); // 如果 user 為 null，跳轉到登入頁
            } else if (user && user.token) {
                console.log("User and token found, fetching customers."); // 確認 user 和 token 是否已加載
                fetchCustomers(user.token); // 如果 user 存在且有 token，則調用 fetchCustomers
            }
        }
    }, [user, loading, navigate]); // 加入 loading 作為依賴

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
            console.log("Fetched data:", data); // 檢查 API 回應數據

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

        if (!token) {
            console.error("Token is missing. Please log in.");
            alert("身份驗證失敗，請重新登錄。");
            return;
        }

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
                        alert("客戶已成功刪除");
                    } else if (response.status === 400) {
                        // 特定錯誤處理：例如客戶與其他記錄有關聯，無法刪除
                        response.json().then(data => {
                            alert(data.error || "無法刪除此客戶，因為該客戶在其他記錄中有關聯。");
                        });
                    } else if (response.status === 401) {
                        // 未授權錯誤，通知用戶重新登錄
                        console.error("Unauthorized. Please log in again.");
                        alert("您的會話已過期，請重新登錄。");
                    } else {
                        // 其他非預期錯誤
                        console.error("Failed to delete customer");
                        alert("刪除客戶失敗，請重試。");
                    }
                })
                .catch(error => {
                    console.error("Error deleting customer:", error);
                    alert("無法連接伺服器，請稍後重試。");
                });
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
                <AddCustomerModal onClose={() => setAddModalOpen(false)}
                                  onCustomerAdded={handleAddCustomer}
                />
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
