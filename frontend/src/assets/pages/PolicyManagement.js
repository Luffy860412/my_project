import React, { useState, useEffect } from 'react';
import './PolicyManagement.css';
import AddPolicyModal from '../modals/AddPolicyModal';
import EditPolicyModal from '../modals/EditPolicyModal';

function PolicyManagement() {
    const [policies, setPolicies] = useState([]);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editPolicy, setEditPolicy] = useState(null);

    // 初次加載組件時獲取所有保單資料
    useEffect(() => {
        fetchPolicies();
    }, []);

    // Helper function to handle fetch errors
    const handleFetchError = (error) => {
        console.error('API request failed:', error);
        alert('無法完成操作，請稍後再試。');
    };

    // 從後端 API 獲取保單列表
    const fetchPolicies = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/policies', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error('Failed to fetch policies');
            const data = await response.json();
            setPolicies(data.policies || []);
        } catch (error) {
            handleFetchError(error);
        }
    };

    // 添加新保單並發送到後端
    const handleAddPolicy = async (policy) => {
        try {
            const token = localStorage.getItem('token');
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

    // 更新保單信息
    const handleEditPolicy = async (updatedPolicy) => {
        try {
            const token = localStorage.getItem('token');
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

    // 刪除保單並更新保單列表
    const handleDeletePolicy = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/policies/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                setPolicies(policies.filter((p) => p.id !== id));
            } else {
                throw new Error('Failed to delete policy');
            }
        } catch (error) {
            handleFetchError(error);
        }
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

            {isAddModalOpen && (
                <AddPolicyModal onClose={() => setAddModalOpen(false)} onPolicyAdded={handleAddPolicy} />
            )}

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
