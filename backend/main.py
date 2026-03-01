from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, String, Text, Integer, ForeignKey, Boolean, func
from sqlalchemy.orm import declarative_base, sessionmaker, Session
import bcrypt
import jwt
import random
import string
import json
from datetime import datetime, timedelta

# --- 1. НАСТРОЙКИ БЕЗОПАСНОСТИ (JWT и Хеширование) ---
SECRET_KEY = "super-secret-key-change-it-later" # Секретный ключ для подписи пропусков
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 30 # Токен живет 30 дней

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

# --- 2. БАЗА ДАННЫХ (SQLite) ---
SQLALCHEMY_DATABASE_URL = "sqlite:///./postcards.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Таблица Пользователей
class UserDB(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    free_cards = Column(Integer, default=0)
    has_made_first_purchase = Column(Boolean, default=False) # <-- НОВОЕ ПОЛЕ

# Таблица Открыток
class CardDB(Base):
    __tablename__ = "cards"
    short_id = Column(String, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String) 
    bg = Column(String)
    emoji = Column(String)
    music = Column(String)
    hm = Column(String, default="") 
    rb = Column(Boolean, default=False) 
    slides = Column(Text)
    created_at = Column(String, default=lambda: datetime.now().strftime("%Y-%m-%d")) # <-- НОВОЕ: Дата создания

# <-- НОВОЕ: Таблица покупок
class TransactionDB(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Integer) # Сколько открыток куплено
    date = Column(String, default=lambda: datetime.now().strftime("%Y-%m-%d")) # Дата покупки

Base.metadata.create_all(bind=engine)

# --- 3. НАСТРОЙКА FASTAPI ---
app = FastAPI(title="Живая Открытка API v2")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- 4. МОДЕЛИ ДАННЫХ (PYDANTIC) ---
class UserCreate(BaseModel):
    username: str
    password: str

class SlideModel(BaseModel):
    h: str
    i: str
    m: str

class CardCreate(BaseModel):
    n: str
    b: str
    e: str
    mu: str
    hm: str = ""   # <-- НОВОЕ
    rb: bool = False # <-- НОВОЕ
    s: list[SlideModel]
    
class AdminAddCards(BaseModel):
    admin_secret: str # Секретный ключ админа
    username: str     # Кому начисляем
    amount: int       # Сколько открыток начисляем

# --- 5. ФУНКЦИИ АВТОРИЗАЦИИ ---
def verify_password(plain_password: str, hashed_password: str):
    # Проверяем пароль (bcrypt работает с байтами, поэтому делаем .encode)
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password: str):
    # Генерируем соль и шифруем пароль
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8') # Возвращаем как обычную строку для базы данных

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Проверка "пропуска" пользователя при каждом запросе
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Неверный токен")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Неверный токен")
    
    user = db.query(UserDB).filter(UserDB.username == username).first()
    if user is None:
        raise HTTPException(status_code=401, detail="Пользователь не найден")
    return user

# --- 6. ЭНДПОИНТЫ API ---

@app.get("/")
def read_root():
    return {"message": "Сервер работает! 🚀 Документация: /docs"}

# Регистрация
@app.post("/api/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(UserDB).filter(UserDB.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Такое имя уже занято")
    
    new_user = UserDB(username=user.username, hashed_password=get_password_hash(user.password))
    db.add(new_user)
    db.commit()
    return {"message": "Регистрация успешна!"}

# Логин (выдача токена)
@app.post("/api/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(UserDB).filter(UserDB.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Неверный логин или пароль")
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer", "free_cards": user.free_cards}

# Сохранение открытки (ТЕПЕРЬ ТРЕБУЕТ ТОКЕН!)
@app.post("/api/cards")
def create_card(card: CardCreate, current_user: UserDB = Depends(get_current_user), db: Session = Depends(get_db)):
    # ПРОВЕРКА БАЛАНСА
    if current_user.free_cards <= 0:
        raise HTTPException(status_code=403, detail="Недостаточно открыток на балансе. Посетите магазин!")

    # Списываем 1 открытку
    current_user.free_cards -= 1
    
    letters_and_digits = string.ascii_letters + string.digits
    letters_and_digits = string.ascii_letters + string.digits
    new_id = ''.join(random.choice(letters_and_digits) for i in range(5))
    while db.query(CardDB).filter(CardDB.short_id == new_id).first():
        new_id = ''.join(random.choice(letters_and_digits) for i in range(5))

    db_card = CardDB(
        short_id=new_id,
        owner_id=current_user.id,
        name=card.n,
        bg=card.b,
        emoji=card.e,
        music=card.mu,
        hm=card.hm, # <-- Сохраняем
        rb=card.rb, # <-- Сохраняем
        slides=json.dumps([slide.model_dump() for slide in card.s])
    )
    
    db.add(db_card)
    db.commit()
    return {"short_id": new_id}

# Получение открытки (Без токена, чтобы друзья могли смотреть)
@app.get("/api/cards/{short_id}")
def get_card(short_id: str, db: Session = Depends(get_db)):
    db_card = db.query(CardDB).filter(CardDB.short_id == short_id).first()
    if db_card is None:
        raise HTTPException(status_code=404, detail="Открытка не найдена")
    return {
        "b": db_card.bg, 
        "e": db_card.emoji, 
        "mu": db_card.music, 
        "hm": db_card.hm, # <-- Отдаем
        "rb": db_card.rb, # <-- Отдаем
        "s": json.loads(db_card.slides)
    }

# Получение списка открыток текущего пользователя
@app.get("/api/my-cards")
def get_my_cards(current_user: UserDB = Depends(get_current_user), db: Session = Depends(get_db)):
    cards = db.query(CardDB).filter(CardDB.owner_id == current_user.id).all()
    # Отдаем только самое необходимое для превьюшек на главном экране
    return [{"id": c.short_id, "name": c.name, "bg": c.bg, "emoji": c.emoji} for c in cards]

# Удаление открытки
@app.delete("/api/cards/{short_id}")
def delete_card(short_id: str, current_user: UserDB = Depends(get_current_user), db: Session = Depends(get_db)):
    # Ищем открытку. Важно: проверяем, что owner_id совпадает с текущим пользователем!
    card = db.query(CardDB).filter(CardDB.short_id == short_id, CardDB.owner_id == current_user.id).first()
    
    if not card:
        raise HTTPException(status_code=404, detail="Открытка не найдена или у вас нет прав на ее удаление")
    
    db.delete(card)
    db.commit()
    return {"message": "Открытка успешно удалена"}

# --- ПАНЕЛЬ АДМИНИСТРАТОРА ---
ADMIN_SECRET_KEY = "my-super-secret-123" # Придумай свой сложный пароль!

@app.post("/api/admin/add-cards")
def admin_add_cards(data: AdminAddCards, db: Session = Depends(get_db)):
    # 1. Проверяем, админ ли это
    if data.admin_secret != ADMIN_SECRET_KEY:
        raise HTTPException(status_code=403, detail="Доступ запрещен. Неверный ключ.")
    
    # 2. Ищем пользователя
    user = db.query(UserDB).filter(UserDB.username == data.username).first()
    if not user:
        raise HTTPException(status_code=404, detail="Пользователь с таким логином не найден.")
    
    # 3. Начисляем открытки
    user.free_cards += data.amount
    db.commit()
    
    return {"message": f"Успех! Пользователю {data.username} добавлено {data.amount} открыток. Текущий баланс: {user.free_cards}"}

class AdminSecret(BaseModel):
    admin_secret: str

# Получение полной статистики для админки
@app.post("/api/admin/users")
def get_all_users_stats(data: AdminSecret, db: Session = Depends(get_db)):
    # Проверяем пароль админа
    if data.admin_secret != ADMIN_SECRET_KEY:
        raise HTTPException(status_code=403, detail="Доступ запрещен. Неверный ключ.")
    
    users = db.query(UserDB).all()
    result = []
    
    total_cards_db = db.query(CardDB).count()
    total_purchases = 0
    
    for u in users:
        # Считаем, сколько открыток создал этот конкретный пользователь
        user_cards_count = db.query(CardDB).filter(CardDB.owner_id == u.id).count()
        if u.has_made_first_purchase:
            total_purchases += 1
            
        result.append({
            "id": u.id,
            "username": u.username,
            "free_cards": u.free_cards,
            "has_made_first_purchase": u.has_made_first_purchase,
            "created_cards": user_cards_count
        })
        
    return {
        "stats": {
            "total_users": len(users),
            "total_cards_created": total_cards_db,
            "total_purchases": total_purchases
        },
        "users": result
    }

# Получение данных текущего пользователя (баланс)
@app.get("/api/me")
def get_me(current_user: UserDB = Depends(get_current_user)):
    return {
        "username": current_user.username,
        "free_cards": current_user.free_cards,
        "has_made_first_purchase": current_user.has_made_first_purchase
    }

class BuyCardsRequest(BaseModel):
    amount: int

# Имитация покупки в магазине
@app.post("/api/buy-cards")
def buy_cards(data: BuyCardsRequest, db: Session = Depends(get_db), current_user: UserDB = Depends(get_current_user)):
    added_amount = data.amount
    bonus_message = ""

    # Проверяем, первая ли это покупка
    if not current_user.has_made_first_purchase:
        added_amount += 3  # Накидываем ровно 3 подарочные!
        current_user.has_made_first_purchase = True
        bonus_message = " (+3 подарочные за первую покупку!)"

    # ВАЖНО: Прибавляем открытки к балансу ТОЛЬКО ОДИН РАЗ!
    current_user.free_cards += added_amount
    
    # Записываем чек о покупке в статистику админки
    new_tx = TransactionDB(user_id=current_user.id, amount=data.amount)
    db.add(new_tx)
    
    db.commit()

    return {
        "message": f"Успешно куплено {data.amount} шт.{bonus_message}",
        "new_balance": current_user.free_cards
    }
    
    # --- ДАННЫЕ ДЛЯ ГРАФИКОВ ---

@app.post("/api/admin/chart-stats")
def get_chart_stats(data: AdminSecret, db: Session = Depends(get_db)):
    if data.admin_secret != ADMIN_SECRET_KEY:
        raise HTTPException(status_code=403, detail="Доступ запрещен.")
    
    # 1. Считаем открытки по дням
    cards_by_date = db.query(CardDB.created_at, func.count(CardDB.short_id)).group_by(CardDB.created_at).all()
    
    # 2. Считаем покупки по дням (суммируем количество купленных штук)
    txs_by_date = db.query(TransactionDB.date, func.sum(TransactionDB.amount)).group_by(TransactionDB.date).all()
    
    return {
        "cards": [{"date": c[0], "count": c[1]} for c in cards_by_date if c[0]],
        "purchases": [{"date": t[0], "amount": t[1]} for t in txs_by_date if t[0]]
    }