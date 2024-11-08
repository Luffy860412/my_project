import React from 'react'; // 引入 React，用於創建組件
import { Link } from 'react-router-dom'; // 引入 Link，用於頁面導航
import './Home.css'; // 引入 Home.css，用於設置首頁的樣式

// 定義 Home 函數組件
function Home() {
    return (
        // 頂層容器，包含整個首頁內容
        <div className="home-container">
            {/* 首頁標題 */}
            <h1>歡迎來到 OneCRM</h1>
            <p>請選擇下列功能來管理您的客戶資料</p>

            {/* 卡片容器，包含多個導航卡片 */}
            <div className="home-cards">
                {/* 客戶列表導航卡片 */}
                <Link to="/customers" className="home-card">客戶列表</Link>

                {/* 客戶分析導航卡片 */}
                <Link to="/customer-analysis" className="home-card">客戶分析</Link>

                {/* 保單管理導航卡片 */}
                <Link to="/policy-management" className="home-card">保單管理</Link>
            </div>
        </div>
    );
}

// 將 Home 組件導出，以便在其他文件中引入並使用
export default Home;