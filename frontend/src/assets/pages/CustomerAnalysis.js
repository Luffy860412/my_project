import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../assets/context/AuthContext';
import './CustomerAnalysis.css';

function CustomerAnalysis() {
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [genderDistribution, setGenderDistribution] = useState({ male: 0, female: 0, other: 0 });
    const [averageAge, setAverageAge] = useState(0);
    const { user } = useContext(AuthContext); // 使用 AuthContext 獲取 user 狀態
    const navigate = useNavigate();

    useEffect(() => {
        // 如果 user 為 null，則重定向到登錄頁面
        if (!user) {
            navigate('/login');
            return;
        }

        const token = localStorage.getItem('token');

        fetch('/api/analysis/overview', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setTotalCustomers(data.total_customers);
                setGenderDistribution(data.gender_distribution);
                setAverageAge(data.average_age || 0);
            })
            .catch(error => console.error('Error fetching analysis data:', error));
    }, [user, navigate]);

    return (
        <div className="customer-analysis-container">
            <h2>客戶分析</h2>

            <div className="analysis-overview">
                <div className="analysis-card">總客戶數: {totalCustomers}</div>
                <div className="analysis-card">
                    男性客戶比例: {((genderDistribution.male / totalCustomers) * 100).toFixed(1)}%
                </div>
                <div className="analysis-card">
                    女性客戶比例: {((genderDistribution.female / totalCustomers) * 100).toFixed(1)}%
                </div>
                <div className="analysis-card">平均年齡: {averageAge}</div>
            </div>

            <div className="charts-section">
                <div className="chart">性別比例圖</div>
                <div className="chart">年齡分布圖</div>
            </div>
        </div>
    );
}

export default CustomerAnalysis;
