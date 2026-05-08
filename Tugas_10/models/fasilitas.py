from pydantic import BaseModel, Field
from typing import Optional, List

class FasilitasBase(BaseModel):
    nama: str = Field(..., min_length=3, description="Nama fasilitas publik")
    kode: Optional[str] = None
    jenis: str = Field(..., description="Jenis/Kategori fasilitas")
    alamat: Optional[str] = None
    kapasitas: Optional[int] = None
    fasilitas: Optional[List[str]] = None

class FasilitasCreate(FasilitasBase):
    longitude: float = Field(..., description="Garis Bujur (X)")
    latitude: float = Field(..., description="Garis Lintang (Y)")

class FasilitasUpdate(FasilitasBase):
    nama: Optional[str] = None
    jenis: Optional[str] = None