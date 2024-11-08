import React, { useState, useEffect } from 'react'; // 引入 React 及 useState, useEffect，用於狀態管理和組件掛載
import './CustomerAnalysis.css'; // 引入 CSS 文件，用於設置客戶分析頁面的樣式

// 定義 CustomerAnalysis 函數組件
function CustomerAnalysis() {
    // 使用 useState 初始化狀態來保存總客戶數、性別比例和平均年齡
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [genderDistribution, setGenderDistribution] = useState({ male: 0, female: 0, other: 0 });
    const [averageAge, setAverageAge] = useState(0);

    // 使用 useEffect 在組件掛載時發送 API 請求來獲取客戶分析數據
    useEffect(() => {
        // 獲取 JWT token
        const token = localStorage.getItem('token');

        // 發送 API 請求，包含 Authorization 標頭
        fetch('/api/analysis/overview', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,  // 添加 JWT token 作為 Bearer token
            },
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
    }, []);

    return (
        <div className="customer-analysis-container">
            <h2>客戶分析</h2>

            {/* 總覽部分，顯示一些關鍵統計數據 */}
            <div className="analysis-overview">
                {/* 顯示總客戶數 */}
                <div className="analysis-card">總客戶數: {totalCustomers}</div>
                {/* 顯示男性客戶比例 */}
                <div className="analysis-card">
                    男性客戶比例: {((genderDistribution.male / totalCustomers) * 100).toFixed(1)}%
                </div>
                {/* 顯示女性客戶比例 */}
                <div className="analysis-card">
                    女性客戶比例: {((genderDistribution.female / totalCustomers) * 100).toFixed(1)}%
                </div>
                {/* 顯示平均年齡 */}
                <div className="analysis-card">平均年齡: {averageAge}</div>
            </div>

            {/* 圖表區域，用於顯示詳細的客戶數據圖表 */}
            <div className="charts-section">
                <div className="chart">性別比例圖</div>
                <div className="chart">年齡分布圖</div>
            </div>
        </div>
    );
}

// 將 CustomerAnalysis 組件導出，以便其他文件可以引入並使用它
export default CustomerAnalysis;
