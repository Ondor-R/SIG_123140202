from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from passlib.context import CryptContext
from pydantic import BaseModel 
from utils.auth import create_token
from database import get_pool

router = APIRouter(tags=["Autentikasi"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserRegister(BaseModel):
    email: str
    password: str

@router.post("/register")
async def register(user: UserRegister):
    pool = await get_pool()
    async with pool.acquire() as conn:
        existing_user = await conn.fetchrow("SELECT * FROM users WHERE email = $1", user.email)
        if existing_user:
            raise HTTPException(status_code=400, detail="Email sudah terdaftar")
            
        hashed_password = pwd_context.hash(user.password)
        
        await conn.execute(
            "INSERT INTO users (email, password_hash) VALUES ($1, $2)",
            user.email, hashed_password
        )
        return {"message": "Registrasi berhasil, silakan login!"}

@router.post("/login")
async def login(form: OAuth2PasswordRequestForm = Depends()):
    pool = await get_pool()
    async with pool.acquire() as conn:
        user = await conn.fetchrow("SELECT * FROM users WHERE email = $1", form.username)
        
        if not user or not pwd_context.verify(form.password, user["password_hash"]):
            raise HTTPException(status_code=401, detail="Email atau password salah")
            
        token = create_token({"sub": user["email"]})
        return {"access_token": token, "token_type": "bearer"}