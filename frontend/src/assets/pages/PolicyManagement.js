import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../assets/context/AuthContext';
import './PolicyManagement.css';
import AddPolicyModal from '../modals/AddPolicyModal';
import EditPolicyModal from '../modals/EditPolicyModal';

function PolicyManagement() {
    const [policies, setPolicies] = useState([]);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editPolicy, setEditPolicy] = useState(null);
    const { user, loading } = useContext(AuthContext); // 添加 loading 狀態
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) { // 確保 loading 結束後再檢查 user 狀態
            if (!user) {
                navigate('/login');
            } else if (user && user.token) {
                fetchPolicies(user.token);
            }
        }
    }, [user, loading, navigate]); // 加入 loading 作為依賴

    // 獲取保單列表的函數
    const fetchPolicies = async (token) => {
        try {
            const response = await fetch('/api/policies', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                if (response.status === 401) {
                    alert('您的會話已過期，請重新登錄');
                    navigate('/login');
                } else {
                    throw new Error('Failed to fetch policies');
                }
            }
            const data = await response.json();
            setPolicies(data.policies || []);
        } catch (error) {
            handleFetchError(error);
        }
    };

    // 添加保單的處理函數
    const handleAddPolicy = async (policy) => {
        try {
            const token = user.token;
            const response = await fetch('/api/policies', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(policy),
            });
            if (response.ok) {
                const newPolicy = await response.json();
                setPolicies([...policies, newPolicy.policy]);
                setAddModalOpen(false);
            } else {
                throw new Error('Failed to add policy');
            }
        } catch (error) {
            handleFetchError(error);
        }
    };

    // 更新保單的處理函數
    const handleEditPolicy = async (updatedPolicy) => {
        try {
            const token = user.token;
            const response = await fetch(`/api/policies/${updatedPolicy.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedPolicy),
            });
            if (response.ok) {
                const updatedData = await response.json();
                setPolicies(policies.map((p) => (p.id === updatedPolicy.id ? updatedData.policy : p)));
                setEditPolicy(null);
            } else {
                throw new Error('Failed to update policy');
            }
        } catch (error) {
            handleFetchError(error);
        }
    };

    // 刪除保單的處理函數
    const handleDeletePolicy = async (id) => {
        try {
            const token = user.token;
            const response = await fetch(`/api/policies/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                setPolicies(policies.filter((p) => p.id !== id));
            } else {
                alert('Failed to delete policy. Please try again later.');
                throw new Error('Failed to delete policy');
            }
        } catch (error) {
            handleFetchError(error);
        }
    };

    // 通用的錯誤處理
    const handleFetchError = (error) => {
        console.error('API request failed:', error);
        alert('無法完成操作，請稍後再試。');
    };

    return (
        <div className="policy-management-container">
            <h2>保單管理</h2>

            <button onClick={() => setAddModalOpen(true)} className="add-policy-button">新增保單</button>

            <table className="policy-table">
                <thead>
                <tr>
                    <th>客戶名稱</th>
                    <th>保單名稱</th>
                    <th>保費金額</th>
                    <th>保險類型</th>
                    <th>購買日期</th>
                    <th>到期日</th>
                    <th>保單狀態</th>
                    <th>操作</th>
                </tr>
                </thead>
                <tbody>
                {policies.map((policy) => (
                    <tr key={policy.id}>
                        <td>{policy.customer_name || '未知'}</td>
                        <td>{policy.policy_name}</td>
                        <td>{policy.premium_amount}</td>
                        <td>{policy.insurance_type}</td>
                        <td>{policy.purchase_date}</td>
                        <td>{policy.expiry_date}</td>
                        <td>{policy.policy_status}</td>
                        <td>
                            <button onClick={() => setEditPolicy(policy)}>編輯</button>
                            <button onClick={() => handleDeletePolicy(policy.id)}>刪除</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* 新增保單模態框 */}
            {isAddModalOpen && (
                <AddPolicyModal onClose={() => setAddModalOpen(false)} onPolicyAdded={handleAddPolicy} />
            )}

            {/* 編輯保單模態框 */}
            {editPolicy && (
                <EditPolicyModal
                    policy={editPolicy}
                    onClose={() => setEditPolicy(null)}
                    onPolicyUpdated={handleEditPolicy}
                />
            )}
        </div>
    );
}

export default PolicyManagement;
