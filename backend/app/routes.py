from flask import Blueprint, request, jsonify  # 引入 Blueprint 用於路由組織，request 處理請求，jsonify 將數據轉為 JSON 格式
from .models import db, User, Customer, Policy, PolicyAnalysis  # 引入數據庫模型
from datetime import datetime  # 引入日期模塊，用於處理日期數據
from sqlalchemy import func
import jwt
from functools import wraps

# 設置密鑰
SECRET_KEY = 'YOUR_SECRET_KEY'

# 創建 Blueprint 對象，命名為 'api'，組織 API 路由
api = Blueprint('api', __name__)

# 認證中間件，用於提取 JWT 中的用戶 ID
def authenticate(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        # 檢查是否提供 Authorization 標頭
        if not token or not token.startswith("Bearer "):
            return jsonify({'error': 'Authorization header must be provided and must start with Bearer'}), 401

        # 提取和解碼 JWT token
        try:
            # 提取 Bearer token
            token = token.split(" ")[1]
            data = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            request.user_id = data['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        
        # 調用被裝飾的路由函數
        return f(*args, **kwargs)
    return decorated_function

# ============== User Authentication Routes ==============

# 用戶註冊路由
@api.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()  # 獲取請求中的 JSON 數據
    username = data.get('username')  # 提取用戶名
    password = data.get('password')  # 提取密碼
    
    # 查詢用戶名是否已存在於數據庫中
    if User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 400  # 用戶名已存在時返回錯誤

    # 創建新用戶對象，並設置用戶名和密碼
    new_user = User(username=username, password=password)
    db.session.add(new_user)  # 將新用戶添加到數據庫會話
    db.session.commit()  # 提交數據庫事務，保存新用戶
    return jsonify({'message': 'User registered successfully', 'user': {'id': new_user.id, 'username': new_user.username}}), 201

# 用戶登錄路由
@api.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()

    # 驗證用戶名和密碼（注意：這裡應使用加密的密碼進行驗證）
    if user and user.password == password:
        # 生成 JWT token，包含用戶 ID 和用戶名
        token = jwt.encode({'user_id': user.id}, SECRET_KEY, algorithm='HS256')
        return jsonify({'token': token, 'user': {'id': user.id, 'username': user.username}}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

# 用戶信息路由，用於獲取當前用戶信息
@api.route('/auth/user', methods=['GET'])
@authenticate
def get_current_user():
    user = User.query.get(request.user_id)
    if user:
        return jsonify({'id': user.id, 'username': user.username}), 200
    return jsonify({'error': 'User not found'}), 404    
# ============== Customer Management Routes ==============

# 添加客戶
@api.route('/customers', methods=['POST'])
@authenticate  # 使用認證中間件（檢查請求中是否包含有效的 JWT token）
def add_customer():
    data = request.get_json()  # 獲取請求中的 JSON 數據
    # 創建新客戶對象，並從請求中提取數據設置屬性
    new_customer = Customer(
        name=data.get('name'),
        phone=data.get('phone'),
        gender=data.get('gender'),
        age=data.get('age'),
        occupation=data.get('occupation'),
        user_id=request.user_id  # 設置 user_id 為當前用戶
    )
    db.session.add(new_customer)  # 將新客戶添加到數據庫會話
    db.session.commit()  # 提交數據庫事務，保存新客戶
    return jsonify({'message': 'Customer added successfully', 'customer': {
            'id': new_customer.id,
            'name': new_customer.name,
            'phone': new_customer.phone,
            'gender': new_customer.gender,
            'age': new_customer.age,
            'occupation': new_customer.occupation
            }
        }), 201

# 獲取所有客戶列表
@api.route('/customers', methods=['GET'])
@authenticate  # 使用認證中間件（檢查請求中是否包含有效的 JWT token）
def get_customers():
    customers = Customer.query.filter_by(user_id=request.user_id).all()  # 根據 user_id 過濾 Customer 查詢結果，僅返回與當前用戶相關的客戶。
    # 將每個客戶格式化為 JSON 格式
    result = [
        {
           'id': customer.id,
           'name':customer.name,
           'phone': customer.phone,
           'gender': customer.gender,
           'age': customer.age,
           'occupation': customer.occupation
        }
        for customer in customers
    ]
    return jsonify({'customers': result}), 200  # 返回所有客戶的 JSON 數據

# 獲取指定客戶的詳細信息
@api.route('/customers/<int:id>', methods=['GET'])
@authenticate  # 使用認證中間件（檢查請求中是否包含有效的 JWT token）
def get_customer(id):
    customer = Customer.query.filter_by(id=id, user_id=request.user_id).first_or_404()  # 根據用戶ID和客戶ID查找
    # 返回客戶的詳細信息
    return jsonify({'customer': {
        'id': customer.id,
        'name': customer.name,
        'phone': customer.phone,
        'gender': customer.gender,
        'age': customer.age
    }}), 200

# 更新客戶信息
@api.route('/customers/<int:id>', methods=['PUT'])
@authenticate  # 使用認證中間件（檢查請求中是否包含有效的 JWT token）
def update_customer(id):
    customer = Customer.query.filter_by(id=id, user_id=request.user_id).first_or_404()  # 根據 ID 查找客戶，若不存在則返回 404
    data = request.get_json()  # 獲取請求中的 JSON 數據
    # 更新客戶的各項信息，若請求中無對應數據則保持原值
    customer.name = data.get('name', customer.name)
    customer.phone = data.get('phone', customer.phone)
    customer.gender = data.get('gender', customer.gender)
    customer.age = data.get('age', customer.age)
    customer.occupation = data.get('occupation', customer.occupation)
    db.session.commit()  # 提交數據庫事務，保存更改
    return jsonify({'message': 'Customer updated successfully', 'customer': {
            'id': customer.id,
            'name': customer.name,
            'phone': customer.phone, 
            'gender': customer.gender,
            'age': customer.age, 
            'occupation': customer.occupation
            }}
        ), 200

# 刪除客戶
@api.route('/customers/<int:id>', methods=['DELETE'])
@authenticate  # 使用認證中間件（檢查請求中是否包含有效的 JWT token）
def delete_customer(id):
    customer = Customer.query.filter_by(id=id, user_id=request.user_id).first_or_404()  # 根據 ID 查找客戶，若不存在則返回 404
    db.session.delete(customer)  # 刪除客戶
    db.session.commit()  # 提交數據庫事務，確認刪除
    return jsonify({'message': 'Customer deleted successfully'}), 200

# ============== Policy Management Routes ==============

# 添加保單
@api.route('/policies', methods=['POST'])
@authenticate # 使用認證中間件（檢查請求中是否包含有效的 JWT token）
def add_policy():
    data = request.get_json()  # 獲取請求中的 JSON 數據
    # 創建新保單對象，並設置保單屬性
    new_policy = Policy(
        policy_name=data.get('policy_name'),
        customer_id=data.get('customer_id'),
        insurance_type=data.get('insurance_type'),
        premium_amount=data.get('premium_amount'),
        purchase_date=datetime.strptime(data.get('purchase_date'), '%Y-%m-%d'),  # 字符串轉日期
        expiry_date=datetime.strptime(data.get('expiry_date'), '%Y-%m-%d'),
        policy_status=data.get('policy_status'),
        user_id=request.user_id  # 設置 user_id 為當前用戶
    )
    db.session.add(new_policy)  # 將新保單添加到數據庫會話
    db.session.commit()  # 提交數據庫事務，保存新保單
    
    # 獲取客戶名稱
    customer_name = new_policy.customer.name if new_policy.customer else "Unknown"
    
    return jsonify({'message': 'Policy added successfully', 'policy': {
            'id': new_policy.id,
            'policy_name': new_policy.policy_name,
            'customer_id': new_policy.customer_id,
            'customer_name': customer_name,
            'insurance_type': new_policy.insurance_type,
            'premium_amount': float(new_policy.premium_amount),
            'purchase_date': new_policy.purchase_date.strftime('%Y-%m-%d'),
            'expiry_date': new_policy.expiry_date.strftime('%Y-%m-%d'),
            'policy_status': new_policy.policy_status
        }
    }), 201

# 獲取所有保單列表
@api.route('/policies', methods=['GET'])
@authenticate # 使用認證中間件（檢查請求中是否包含有效的 JWT token）
def get_policies():
    try:
        # 只查詢當前用戶的保單
        policies = Policy.query.filter_by(user_id=request.user_id).all()
        
        # 格式化保單信息為 JSON，並包含客戶名稱
        result = [
            {
                'id': policy.id,
                'policy_name': policy.policy_name,  # 保險名稱
                'customer_id': policy.customer_id,  # 客戶名稱 ID
                'customer_name': policy.customer.name if policy.customer else '未知',  # 客戶名稱（若無則顯示 '未知'）
                'insurance_type': policy.insurance_type,  # 保險類型
                'premium_amount': float(policy.premium_amount),  # 保費金額
                'purchase_date': policy.purchase_date.strftime('%Y-%m-%d'),  # 保單購買日期
                'expiry_date': policy.expiry_date.strftime('%Y-%m-%d'),  # 保單到期日
                'policy_status': policy.policy_status  # 保單狀態
            }
            for policy in policies
        ]
        
        return jsonify({'policies': result}), 200  # 返回包含客戶名稱的保單 JSON 數據
    except Exception as e:
        print(f"Error fetching policies: {e}")  # 後端日誌記錄錯誤
        return jsonify({'error': 'Failed to fetch policies'}), 500  # 返回錯誤訊息


# 更新保單信息
@api.route('/policies/<int:id>', methods=['PUT'])
@authenticate # 使用認證中間件（檢查請求中是否包含有效的 JWT token）
def update_policy(id):
    # 查詢當前用戶的保單，若不存在則返回 404
    policy = Policy.query.get_or_404(id)  # 根據 ID 查找保單，若不存在則返回 404
    data = request.get_json()  # 獲取請求中的 JSON 數據
    # 更新保單的各項信息，若請求中無對應數據則保持原值
    policy.policy_name = data.get('policy_name', policy.policy_name)  # 保險名稱
    policy.insurance_type = data.get('insurance_type', policy.insurance_type)  # 保險類型
    policy.premium_amount = data.get('premium_amount', policy.premium_amount)  # 保費金額
    policy.purchase_date = datetime.strptime(data.get('purchase_date'), '%Y-%m-%d') if data.get('purchase_date') else policy.purchase_date  # 保單購買日
    policy.expiry_date = datetime.strptime(data.get('expiry_date'), '%Y-%m-%d') if data.get('expiry_date') else policy.expiry_date # 保單到期日
    policy.policy_status = data.get('policy_status', policy.policy_status)  # 保單狀態
    db.session.commit()  # 提交數據庫事務，保存更改
    
    # 獲取客戶姓名
    customer_name = policy.customer.name if policy.customer else "Unknown"
    
    return jsonify({'message': 'Policy updated successfully', 'policy': {
        'id': policy.id, # 保單的唯一標識符
        'policy_name': policy.policy_name, # 保單名稱
        'insurance_type': policy.insurance_type, # 保險類型
        'premium_amount': float(policy.premium_amount), # 保費金額
        'purchase_date': policy.purchase_date.strftime('%Y-%m-%d'),  # 保單購買日期
        'expiry_date': policy.expiry_date.strftime('%Y-%m-%d'), # 保單到期日期
        'policy_status': policy.policy_status, # 保單狀態
        'customer_id': policy.customer_id, # 該保單關聯的客戶 ID
        'customer_name': customer_name # 客戶名稱
        }}
    ), 200

# 刪除保單
@api.route('/policies/<int:id>', methods=['DELETE'])
@authenticate # 使用認證中間件（檢查請求中是否包含有效的 JWT token）
def delete_policy(id):
    policy = Policy.query.filter_by(id=id, user_id=request.user_id).first_or_404()  # 根據 ID 查找保單，若不存在則返回 404
    db.session.delete(policy)  # 刪除保單
    db.session.commit()  # 提交數據庫事務，確認刪除
    return jsonify({'message': 'Policy deleted successfully'}), 200

# ============== Customer Analysis Routes ==============

# 總覽客戶分析 - 僅限於當前用戶的客戶
@api.route('/analysis/overview', methods=['GET'])
@authenticate   # 確保已登錄
def customer_analysis_overview():
    # 僅統計當前用戶的客戶
    user_id = request.user_id  # 獲取當前用戶的 ID
    total_customers = Customer.query.filter_by(user_id=user_id).count()  # 計算該用戶的總客戶數
    
    # 計算不同性別的客戶數量
    gender_distribution = {
        'male': Customer.query.filter_by(user_id=user_id, gender='male').count(),
        'female': Customer.query.filter_by(user_id=user_id, gender='female').count(),
        'other': Customer.query.filter_by(user_id=user_id, gender='other').count()
    }
    
    # 計算平均年齡
    total_age = db.session.query(func.sum(Customer.age)).filter_by(user_id=user_id).scalar() or 0
    average_age = total_age / total_customers if total_customers > 0 else 0
 
    # 返回 JSON 結果
    return jsonify({
        'total_customers': total_customers,
        'gender_distribution': gender_distribution,
        'average_age': round(average_age, 1)  # 將平均年齡四捨五入至小數點後一位
    }), 200  # 返回分析結果

# 獲取特定客戶的保單分析並保存到 PolicyAnalysis
@api.route('/analysis/customer/<int:id>', methods=['GET'])
@authenticate # 使用認證中間件（檢查請求中是否包含有效的 JWT token）
def individual_customer_analysis(id):
    customer = Customer.query.get_or_404(id)  # 根據 ID 查找客戶，若不存在則返回 404
    # 僅允許查看當前用戶的客戶
    user_id = request.user_id
    customer = Customer.query.filter_by(id=id, user_id=user_id).first_or_404()
    
    # 檢查是否已有該客戶的分析結果
    analysis = PolicyAnalysis.query.filter_by(customer_id=id).first()
    
    # 若無分析結果，則進行即時計算並保存到 PolicyAnalysis
    if not analysis:
        policies = Policy.query.filter_by(customer_id=id).all()  # 查詢該客戶的所有保單
        total_premium = sum([policy.premium_amount for policy in policies])  # 計算總保費
        total_policies = len(policies)  # 計算保單總數

        # 創建新的 PolicyAnalysis 條目，儲存分析結果
        analysis = PolicyAnalysis(
            customer_id=customer.id,
            total_policies=total_policies,
            total_premium=total_premium,
            created_at=datetime.utcnow()
        )
        db.session.add(analysis)  # 將分析結果添加到數據庫會話
        db.session.commit()  # 提交數據庫事務，保存分析結果

    # 返回分析結果，包括保單的明細
    result = {
        'customer_id': customer.id,
        'total_policies': analysis.total_policies,
        'total_premium': float(analysis.total_premium),
        'policies': [
            {'policy_name': policy.policy_name, 'premium_amount': float(policy.premium_amount)}
            for policy in Policy.query.filter_by(customer_id=id).all()
        ]
    }
    return jsonify(result), 200  # 返回分析數據

