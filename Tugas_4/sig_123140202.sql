-- 5 query spasial wajib ST_Distance, ST_Intersects, ST_Contains/ST_Within

-- Menghitung jarak antar fasilitas publik dgn ST_Distance
SELECT ST_Distance(
a.geom::geography,
b.geom::geography
) as jarak_meter
FROM transportasi.halte a, transportasi.halte b
WHERE a.nama = 'Halte Sukarame'
AND b.nama = 'Halte Kemiling';

-- Menghitung luas wilayah dgn ST_Area
SELECT
nama,
ROUND(ST_Area(geom::geography)::numeric)
as luas_m2,
ROUND(ST_Area(geom::geography)::numeric
/ 10000, 2) as luas_ha
FROM transportasi.wilayah
WHERE tipe = 'kecamatan'
LIMIT 3;

-- Menghitung panjang rute dgn ST_Length
SELECT nama,
ROUND(ST_Length(geom::geography)::numeric)
as panjang_route_m
FROM transportasi.rute LIMIT 3;

-- Mencari fasilitas publik yang berada dalam wilayah tertentu dgn ST_Intersects
SELECT j.nama as jalan
FROM transportasi.rute j, transportasi.wilayah k
WHERE k.nama = 'Rajabasa'
AND ST_Intersects(j.geom, k.geom);

-- Mencari fasilitas publik yang berada dalam wilayah tertentu dgn ST_Contains
SELECT k.nama, COUNT(f.id) as jumlah
FROM transportasi.wilayah k
LEFT JOIN transportasi.parkir f
ON ST_Contains(k.geom, f.geom)
GROUP BY k.nama
ORDER BY jumlah DESC;

-- Implementasi K-NN
SELECT
nama,
ROUND(ST_Distance(
geom::geography,
ST_GeomFromText('POINT(105.27 -5.36)',4326)
::geography
)::numeric) as jarak_m
FROM transportasi.halte
WHERE jenis = 'brt'
ORDER BY geom <->
ST_GeomFromText('POINT(105.27 -5.36)',4326)
LIMIT 5;
