import rasterio
from rasterio.transform import from_bounds
import cv2
import os

image_path = 'dataset_citra_images/jalan_ryacudu.png'

if not os.path.exists(image_path):
    print(f"file {image_path} not found!")
else:
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    h, w, bands = img.shape

    min_lon, min_lat = 105.3125, -5.3590
    max_lon, max_lat = 105.3155, -5.3575

    transform = from_bounds(min_lon, min_lat, max_lon, max_lat, w, h)

    with rasterio.open(
        'itera_georef.tif', 'w', driver='GTiff',
        height=h, width=w, count=bands, dtype=img.dtype,
        crs='+proj=latlong', transform=transform,
    ) as dst:
        for i in range(bands):
            dst.write(img[:, :, i], i + 1)

    print("Tahap 1 Selesai: File 'itera_georef.tif' berhasil dibuat!")