from flask import Flask # 引入 Flask 框架中的 Flask 類，用於創建應用實例
from .config import Config # 從當前目錄的 config 模塊中引入 Config 類，這個類包含應用程序的所有配置，例如密鑰、數據庫 URI 等
from .extensions import db, migrate # 從 extensions 模塊中引入 db 和 migrate，這些是之前初始化的 SQLAlchemy 和 Flask-Migrate 實例，用於數據庫操作和數據庫遷移
from .routes import api # 從 routes 模塊中引入 api，這是一個藍圖（Blueprint）對象，通常包含與 API 相關的所有路由定義。
from flask_cors import CORS

# 定義創建 Flask 應用程序的函數
def create_app():
    # 創建一個 Flask 應用程序實例
    app = Flask(__name__)
    CORS(app)  # 啟用 CORS
    
    # 使用配置對象進行應用配置
    app.config.from_object(Config)

    # 初始化擴展（例如數據庫和遷移工具）
    db.init_app(app)
    migrate.init_app(app, db)

    # 註冊藍圖
    # 藍圖用於將路由組織在一起，這樣代碼更加模塊化和易於管理
    app.register_blueprint(api, url_prefix='/api')

    # 返回已經配置好的應用程序實例
    return app
