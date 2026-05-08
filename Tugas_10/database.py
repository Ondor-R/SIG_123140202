import asyncpg
import os

DATABASE_URL = "postgresql://postgres:18oktober@localhost:5432/sig_123140202"
pool = None
async def get_pool():
    global pool
    if pool is None:
        pool = await asyncpg.create_pool(DATABASE_URL)
    return pool

async def close_pool():
    global pool
    if pool is not None:
        await pool.close()