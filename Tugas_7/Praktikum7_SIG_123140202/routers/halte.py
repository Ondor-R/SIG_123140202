from fastapi import APIRouter, HTTPException
from database import get_pool
from models import HalteCreate
import json

router = APIRouter(prefix="/api/halte", tags=["Transportasi - Halte"])

#get all halte
@router.get("/")
async def get_halte():
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch("""SELECT id, nama, kode, jenis, alamat, ST_AsGeoJSON(geom) FROM transportasi.halte""")
        return [dict(row) for row in rows]

#get halte by id  
@router.get("/{id}")
async def get_halte_by_id(id: int):
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow("""SELECT id, nama, kode, jenis, alamat, ST_X(geom) AS longitude, ST_Y(geom) AS latitude FROM transportasi.halte WHERE id = $1""", id)
        if not row:
            raise HTTPException(status_code=404, detail="Halte not found")
        return dict(row)

# get GEOJSON
@router.get("/data/geojson")
async def get_halte_geojson():
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch("""SELECT id, nama, kode, jenis, alamat, ST_AsGeoJSON(geom) AS geom FROM transportasi.halte""")
        features = []
        for row in rows:
            feature = {
                "type": "Feature",
                "geometry": json.loads(row["geom"]),
                "properties": {
                    "id": row["id"],
                    "nama": row["nama"],
                    "kode": row["kode"],
                    "jenis": row["jenis"],
                    "alamat": row["alamat"]
                }
            }
            features.append(feature)
        return {"type": "FeatureCollection", "features": features}

# get Nearby
@router.get("/search/nearby")
async def search_nearby_halte(longitude: float, latitude: float, radius: float):
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch("""
            SELECT id, nama, kode, jenis, alamat, ROUND(ST_Distance(geom::geography, ST_Point($1, $2)::geography)::numeric) AS jarak_m
            FROM transportasi.halte
            WHERE ST_DWithin(geom::geography, ST_Point($1, $2)::geography, $3)
        """, longitude, latitude, radius)
        return [dict(row) for row in rows]

# POST
@router.post("/")
async def create_halte(halte: HalteCreate):
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow("""
            INSERT INTO transportasi.halte (nama, kode, jenis, alamat, geom)
            VALUES ($1, $2, $3, $4, $5, $6, ST_SetSRID(ST_Point($7, $8), 4326))
            RETURNING id
        """, halte.nama, halte.kode, halte.jenis, halte.alamat, halte.longitude, halte.latitude)
        return {"id": row["id"]}
    
# Delete
@router.delete("/{id}")
async def delete_halte(id: int):
    pool = await get_pool()
    async with pool.acquire() as conn:
        result = await conn.execute("""DELETE FROM transportasi.halte WHERE id = $1""", id)
        if result == "DELETE 0":
            raise HTTPException(status_code=404, detail="Halte not found")
        return {"message": "Halte deleted successfully"}