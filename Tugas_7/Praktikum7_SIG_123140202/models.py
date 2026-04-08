from pydantic import BaseModel, Field
from typing import Optional, List

class Halte(BaseModel):
    nama: str = Field(..., description="Nama halte")
    kode: str = Field(..., description="Kode halte")
    jenis: str = Field(..., description="Jenis halte [brt | bus | angkot]")
    alamat: Optional[str] = None

class HalteCreate(Halte):
    longitude: float = Field(..., ge=-180, le=180, description="Longitude lokasi halte")
    latitude: float = Field(..., ge=-90, le=90, description="Latitude lokasi halte")