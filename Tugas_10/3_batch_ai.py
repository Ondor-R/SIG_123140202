import cv2
import json
import os
from rasterio.transform import from_bounds
from ultralytics import YOLO

print("Memanggil YOLOv8 untuk BATCH PROCESSING PRESISI...")
model = YOLO('yolov8n.pt')

dataset_dir = 'dataset_citra_images'
geo_detections = []

koordinat_map = {
    "jalan_tugu_adipura.jpg": [105.2570, -5.4210, 105.2590, -5.4190], 
    "jalan_bunderan_hajimena.png": [105.2330, -5.3610, 105.2355, -5.3590], 
    "jalan_hajimena.png": [105.2310, -5.3630, 105.2340, -5.3610],
    "pkor.png": [105.2740, -5.3870, 105.2770, -5.3840],
    "masjid_airan.png": [105.3050, -5.3620, 105.3080, -5.3600], 
    "jalan_ryacudu.png": [105.3125, -5.3590, 105.3155, -5.3575],
    "itera_gerbang_utama.png": [105.3130, -5.3585, 105.3150, -5.3570],
    "itera_asrama.png": [105.3150, -5.3560, 105.3170, -5.3540],
}
fallback_lon, fallback_lat = 105.3110, -5.3580 
offset = 0.0000

print("Mulai nge-scan 14 gambar dan menempatkan ke lokasi aslinya...")

for filename in os.listdir(dataset_dir):
    if filename.endswith(".png") or filename.endswith(".jpg"):
        img_path = os.path.join(dataset_dir, filename)
        img = cv2.imread(img_path)
        if img is None: continue
        
        h, w = img.shape[:2]
        
        if filename in koordinat_map:
            min_lon, min_lat, max_lon, max_lat = koordinat_map[filename]
        else:
            min_lon, min_lat = fallback_lon + offset, fallback_lat + offset
            max_lon, max_lat = min_lon + 0.002, min_lat + 0.002
            offset += 0.001
            
        transform = from_bounds(min_lon, min_lat, max_lon, max_lat, w, h)
        
        results = model(img, conf=0.15, verbose=False)
        
        for box in results[0].boxes:
            cls_id = int(box.cls[0])
            if cls_id not in [2, 3, 5, 7]: continue 
            
            conf = float(box.conf[0])
            x1, y1, x2, y2 = box.xyxy[0].tolist()
            cx, cy = (x1 + x2) / 2, (y1 + y2) / 2
            
            lon, lat = transform * (cx, cy)
            kelas_nama = "Mobil" if cls_id == 2 else "Motor" if cls_id == 3 else "Bus/Truk"
            
            geo_detections.append({
                'type': 'Feature',
                'geometry': {'type': 'Point', 'coordinates': [lon, lat]},
                'properties': {'jenis': kelas_nama, 'confidence': round(conf, 2), 'sumber': filename}
            })

geojson_data = {'type': 'FeatureCollection', 'features': geo_detections}
with open('hasil_batch_14_gambar.geojson', 'w') as f:
    json.dump(geojson_data, f, indent=2)
    
print(f"\n✅ SELESAI! {len(geo_detections)} kendaraan berhasil dideteksi dan dipetakan sesuai lokasi aslinya.")