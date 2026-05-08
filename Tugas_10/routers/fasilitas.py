from fastapi import APIRouter, HTTPException
import json 
from database import get_pool
from models.fasilitas import FasilitasCreate, FasilitasUpdate

router = APIRouter(prefix="/api/halte", tags=["Halte Transportasi"])
@router.get("/")
async def get_halte_geojson(jenis: str = None):
    pool = await get_pool()
    async with pool.acquire() as conn:
        query = "SELECT transportasi.get_halte_geojson($1);"
        row = await conn.fetchval(query, jenis)
        
        if not row:
            return {"type": "FeatureCollection", "features": []}
            
        return json.loads(row) 
    
@router.delete("/{id}") 
async def delete_halte(id: int):
    from fastapi import HTTPException
    from database import get_pool
    pool = await get_pool()
    async with pool.acquire() as conn:
        result = await conn.execute("DELETE FROM halte WHERE id = $1", id)
        if result == "DELETE 0":
            raise HTTPException(status_code=404, detail="Halte tidak ditemukan")
        return {"message": "Data Halte berhasil dihapus!"}