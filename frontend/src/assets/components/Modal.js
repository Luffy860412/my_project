import React from 'react'; // 引入 React 以便創建組件
import './Modal.css'; // 引入 CSS 文件，設置模態框的樣式

// 定義 Modal 函數組件
function Modal({ title, children, onClose }) {
    return (
        // 整個模態框的覆蓋層，用於覆蓋頁面其他部分
        <div className="modal-overlay">
            {/* 模態框的內容容器 */}
            <div className="modal-content">
                {/* 模態框的標題和關閉按鈕 */}
                <div className="modal-header">
                    <h2>{title}</h2> {/* 顯示傳入的模態框標題 */}
                    {/* 關閉按鈕，點擊時調用 onClose 函數來關閉模態框 */}
                    <button onClick={onClose} className="close-button">&times;</button>
                </div>
                {/* 模態框的內容區域 */}
                <div className="modal-body">
                    {children} {/* 顯示模態框的子元素內容 */}
                </div>
            </div>
        </div>
    );
}

// 將 Modal 組件導出，以便其他文件可以引入並使用
export default Modal;
