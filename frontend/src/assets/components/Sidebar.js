import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Home, Users, FileText, BarChart2 } from "lucide-react";
import { Link } from 'react-router-dom'; // 導入 Link 元件
import './Sidebar.css';

export default function Sidebar({ items }) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const defaultItems = [
        { icon: Home, label: "首頁", href: "/home" },
        { icon: Users, label: "客戶", href: "/customers" },
        { icon: FileText, label: "保單", href: "/policy-management" },
        { icon: BarChart2, label: "數據分析", href: "/analysis" },
    ];

    const menuItems = items || defaultItems;

    return (
        <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
            {/* 側邊欄主容器，根據 isCollapsed 狀態添加 "collapsed" 類 */}
            <div className="sidebar-header">
                <h3 className={isCollapsed ? "hidden" : ""}>導覽目錄</h3>
                {/* 標題 "側邊欄"，根據 isCollapsed 狀態隱藏 */}

                <button
                    className="sidebar-toggle"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    aria-label={isCollapsed ? "展開側邊欄" : "收起側邊欄"}
                >
                    {/* 切換按鈕，用於展開/折疊側邊欄 */}
                    {/* aria-label 動態設定，方便輔助技術識別按鈕的作用 */}
                    {/* 根據 isCollapsed 狀態顯示不同圖標：折疊顯示 ChevronRight，展開顯示 ChevronLeft */}
                    {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </button>
            </div>

            <nav className="sidebar-nav">
                {/* 側邊欄的導航容器 */}
                {menuItems.map((item, index) => (
                    <Link key={index} to={item.href} className="sidebar-item">
                        {/* 使用 React Router 的 Link 元件，當點擊鏈接時會進行路由導航而非刷新頁面 */}
                        <item.icon className="sidebar-icon" />
                        {/* 動態顯示圖標 */}
                        <span className={isCollapsed ? "hidden" : ""}>{item.label}</span>
                        {/* 根據 isCollapsed 狀態隱藏或顯示導航文字 */}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}
