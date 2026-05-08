from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import get_pool, close_pool
from routers import fasilitas 
from routers import fasilitas, auth

@asynccontextmanager
async def lifespan(app: FastAPI):
    await get_pool()
    print("Database PostGIS Berhasil Terkoneksi!")
    yield
    await close_pool()
    print("Koneksi Database Ditutup.")

app = FastAPI(
    title="WebGIS FullStack API Reyhan Oktavian Putra",
    description="API untuk Manajemen Data Spasial Transportasi dan Pertanian",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Sistem WebGIS Full-Stack Aktif!"}

app.include_router(fasilitas.router)
app.include_router(auth.router)