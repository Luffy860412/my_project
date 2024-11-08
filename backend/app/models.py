from datetime import datetime
from .extensions import db  # 從 extensions 導入 db


# 定義用戶模型，代表用戶表
class User(db.Model):
    __tablename__ = 'users'  # 明確表名為 'users'
    id = db.Column(db.Integer, primary_key=True)  # 用戶唯一標識符
    username = db.Column(db.String(80), unique=True, nullable=False)  # 用戶名，必須唯一且不為空
    password = db.Column(db.String(255), nullable=False)  # 用戶密碼，必須填寫
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # 記錄用戶創建時間，默認為當前時間
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # 記錄用戶更新時間，自動更新
    
    customers = db.relationship('Customer', back_populates='user')  # 定義 User 到 Customers 的一對多關係
    policies = db.relationship('Policy', back_populates='user')  # 與 Policy 的關聯
    
    def __repr__(self):
        return f"<User {self.username}>"

# 定義客戶模型，代表客戶表
class Customer(db.Model):
    __tablename__ = 'customers'  # 明確表名為 'customers'
    id = db.Column(db.Integer, primary_key=True)  # 客戶唯一標識符
    name = db.Column(db.String(100), nullable=False)  # 客戶名稱，必須填寫
    phone = db.Column(db.String(20), nullable=False)  # 客戶電話號碼，必須填寫
    gender = db.Column(db.Enum('male', 'female', 'other'), nullable=False)  # 客戶性別，必須填寫
    age = db.Column(db.Integer)  # 客戶年齡，選填
    occupation = db.Column(db.String(100))  # 添加職業欄位，選填
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # 記錄客戶創建時間，默認為當前時間
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # 記錄客戶更新時間，自動更新
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)  # 添加外鍵，與用戶建立關聯
    
    user = db.relationship('User', back_populates='customers') # 定義 Customer 到 User 的一對多關係
    
    # 定義與保單的關係，一個客戶可以有多個保單
    policies = db.relationship('Policy', backref='customer', lazy=True)

    def __repr__(self):
        return f"<Customer {self.name}>"

# 定義保單模型，代表保單表
class Policy(db.Model):
    __tablename__ = 'policies'  # 明確表名為 'policies'
    id = db.Column(db.Integer, primary_key=True)  # 保單唯一標識符
    policy_name = db.Column(db.String(100), nullable=False)  # 保單名稱，必須填寫
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id', ondelete='CASCADE'), nullable=False)  # 外鍵，連接客戶表，客戶刪除則相關保單刪除
    insurance_type = db.Column(db.Enum('health', 'life', 'accident'), nullable=False)  # 保險類型，必須填寫
    premium_amount = db.Column(db.Numeric(10, 2), nullable=False)  # 保費金額，必須填寫
    purchase_date = db.Column(db.Date, nullable=False)  # 保單購買日期，必須填寫
    expiry_date = db.Column(db.Date, nullable=False)  # 保單過期日期，必須填寫
    policy_status = db.Column(db.Enum('active', 'expired'), nullable=False)  # 保單狀態，有效或已過期，必須填寫
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # 記錄保單創建時間，默認為當前時間
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)  # 記錄保單更新時間，自動更新
    
    # 新增的 user_id 外鍵欄位
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user = db.relationship('User', back_populates='policies')  # 與 User 表的反向關聯
    def __repr__(self):
        return f"<Policy {self.policy_name} for Customer {self.customer_id}>"

# 定義保單分析模型，儲存對客戶保單的分析信息
class PolicyAnalysis(db.Model):
    __tablename__ = 'policy_analysis'  # 明確表名為 'policy_analysis'
    id = db.Column(db.Integer, primary_key=True)  # 保單分析唯一標識符
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id', ondelete='CASCADE'), nullable=False)  # 外鍵，連接客戶表
    total_policies = db.Column(db.Integer, nullable=False)  # 客戶擁有的保單總數，必須填寫
    total_premium = db.Column(db.Numeric(10, 2), nullable=False)  # 客戶總保費金額，必須填寫
    created_at = db.Column(db.DateTime, default=datetime.utcnow)  # 記錄分析結果創建時間，默認為當前時間

    def __repr__(self):
        return f"<PolicyAnalysis for Customer {self.customer_id}>"
