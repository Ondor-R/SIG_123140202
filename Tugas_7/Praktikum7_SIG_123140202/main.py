from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import get_pool, close_pool
from routers import halte

@asynccontextmanager
async def lifespan(app: FastAPI):
    await get_pool()
    print("Database connection pool created")
    yield
    await close_pool()
    print("Database connection pool closed")

app = FastAPI(
    title="webGis API - SIG 123140202 - Praktikum 7", 
    description="API untuk data transportasi seperti halte, rute, dan lainnya", 
    version="1.0.0", 
    lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(halte.router)