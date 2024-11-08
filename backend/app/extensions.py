from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

# 初始化擴展

# db 是 SQLAlchemy 的實例，用於與數據庫進行交互
# SQLAlchemy 是一個 ORM（對象關係映射）工具，可以將 Python 類映射到數據庫表，簡化數據庫操作
db = SQLAlchemy()

# migrate 是 Flask-Migrate 的實例，用於管理數據庫遷移
# Flask-Migrate 是基於 Alembic 的擴展，用來處理數據庫模式變更，方便進行增量更新
migrate = Migrate()
