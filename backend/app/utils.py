import jwt # 引入 jwt 庫，用於生成和解碼 JSON Web Token。
from datetime import datetime, timedelta # 引入 datetime 和 timedelta，用於設置 Token 的過期時間。
from flask import request, jsonify # 引入 request 用於訪問請求對象，jsonify 用於返回 JSON 格式的響應。
from .config import Config # 引入自定義的配置類 Config，其中包含了 SECRET_KEY。

# 生成 JWT Token
def generate_token(user_id):
    # 創建 Token 的有效載荷 (payload)，包含用戶 ID 和過期時間
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + timedelta(hours=1)  # Token 過期時間設為 1 小時
    }
    # 使用 SECRET_KEY 和 HS256 算法來生成 JWT Token
    token = jwt.encode(payload, Config.SECRET_KEY, algorithm='HS256')
    return token

# 驗證 JWT Token
def verify_token(token):
    try:
        # 解碼 Token，返回用戶 ID
        payload = jwt.decode(token, Config.SECRET_KEY, algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        # 捕捉 Token 已過期的異常，返回 None 表示無效
        return None
    except jwt.InvalidTokenError:
        # 捕捉無效 Token 的異常，返回 None 表示無效
        return None

# 從請求頭中獲取 JWT Token
def get_token_from_header():
    # 獲取 'Authorization' 標頭，預期格式為 'Bearer <token>'
    auth_header = request.headers.get('Authorization')
    if auth_header and auth_header.startswith('Bearer '):
        # 取出標頭中的 Token 部分
        return auth_header.split(' ')[1]
    return None

# 需要驗證 Token 的裝飾器
def token_required(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        # 從請求中提取 Token
        token = get_token_from_header()
        if not token:
            # 如果沒有 Token，返回 401 錯誤
            return jsonify({'message': 'Token is missing!'}), 401
        # 驗證 Token，如果無效或過期，返回 401 錯誤
        user_id = verify_token(token)
        if not user_id:
            return jsonify({'message': 'Token is invalid or expired!'}), 401
        # 如果 Token 有效，將 user_id 傳給原函數
        return f(user_id, *args, **kwargs)
    return decorated
