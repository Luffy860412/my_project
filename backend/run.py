from flask import Flask, send_from_directory
from app.config import Config  # 絕對導入 config 模塊
from app.extensions import db, migrate  # 絕對導入 extensions 模塊
from app.routes import api  # 絕對導入 routes 模塊

# 創建 Flask 應用程序
def create_app():
    app = Flask(__name__, static_folder='../frontend/build')
    app.config.from_object(Config)

    # 初始化擴展
    db.init_app(app)
    migrate.init_app(app, db)

    @app.route('/')
    def serve():
        return send_from_directory(app.static_folder, 'index.html')
    
    # 靜態資源路由（確保其他前端資源也被提供）
    @app.route('/<path:path>')
    def static_proxy(path):
        return send_from_directory(app.static_folder, path)

    # 註冊藍圖
    app.register_blueprint(api, url_prefix='/api')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)
