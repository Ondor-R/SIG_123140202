import cv2
import rasterio
import json
from ultralytics import YOLO

print("Sedang memanggil otak YOLOv8...")
model = YOLO('yolov8n.pt') 

def detect_and_export(tiff_path, tile_size=640):
    img = cv2.imread(tiff_path)
    h, w = img.shape[:2]
    
    src = rasterio.open(tiff_path)
    transform = src.transform
    
    geo_detections = []
    
    print("Mulai memindai kendaraan dengan YOLO...")
    for y in range(0, h, tile_size):
        for x in range(0, w, tile_size):
            tile = img[y:y+tile_size, x:x+tile_size]
            if tile.shape[0] < 100 or tile.shape[1] < 100: continue
            
            results = model(tile, conf=0.15, verbose=False)
            
            for box in results[0].boxes:
                cls_id = int(box.cls[0])
                if cls_id not in [2, 3, 5, 7]: continue 
                
                conf = float(box.conf[0])
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                
                cx_pixel = (x1 + x2) / 2 + x
                cy_pixel = (y1 + y2) / 2 + y
                
                lon, lat = transform * (cx_pixel, cy_pixel)
                kelas_nama = "Mobil" if cls_id == 2 else "Motor" if cls_id == 3 else "Bus/Truk"
                
                geo_detections.append({
                    'type': 'Feature',
                    'geometry': {'type': 'Point', 'coordinates': [lon, lat]},
                    'properties': {'jenis': kelas_nama, 'confidence': round(conf, 2)}
                })

    geojson_data = {'type': 'FeatureCollection', 'features': geo_detections}
    with open('hasil_deteksi.geojson', 'w') as f:
        json.dump(geojson_data, f, indent=2)
        
    print(f"Tahap 2 Selesai! YOLO berhasil mendeteksi {len(geo_detections)} kendaraan.")
    print("File 'hasil_deteksi.geojson' siap dipakai!")

detect_and_export('itera_georef.tif')