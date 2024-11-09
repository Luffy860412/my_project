import os

# 定義一個配置類 Config，通常用來集中管理應用程序的設置
class Config:
    # SECRET_KEY 用於保護會話數據、防篡改和 CSRF 保護
    # 這裡首先從環境變量中獲取 'SECRET_KEY'，如果沒有設置，則使用默認的 'dev_secret_key'（開發環境使用）
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev_secret_key')

    # SQLALCHEMY_DATABASE_URI 用於指定應用使用的數據庫的 URI
    # 從環境變量中獲取 'DATABASE_URI'，如果沒有，則默認使用 SQLite 數據庫，存儲在當前目錄下的 crm.db 文件中
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URI', 'mysql://root:clannad91205@127.0.0.1:3306/crm_database')

    # SQLALCHEMY_TRACK_MODIFICATIONS 用來禁用 SQLAlchemy 追蹤對象的變更，這樣可以節省內存並提高性能
    SQLALCHEMY_TRACK_MODIFICATIONS = False
