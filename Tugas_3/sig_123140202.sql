-------------------------------------------------------------------------- Praktikum 3
-- Mengecek SRID dari kolom geometry 
SELECT ST_SRID(geom) as srid
FROM fasilitas_publik
LIMIT 1;

SELECT ST_SRID(geom) as srid
FROM jalan
LIMIT 1;

SELECT ST_SRID(geom) as srid
FROM wilayah
LIMIT 1;

-- Transformasi data ke 32748 (UTM Zone 48S) dgn ST_Transform
SELECT
nama,
ST_AsText(geom) as wgs84,
ST_AsText(
ST_Transform(geom, 32748)
) as utm48s
FROM fasilitas_publik;

SELECT
nama,
ST_AsText(geom) as wgs84,
ST_AsText(
ST_Transform(geom, 32748)
) as utm48s
FROM jalan;

SELECT
nama,
ST_AsText(geom) as wgs84,
ST_AsText(
ST_Transform(geom, 32748)
) as utm48s
FROM wilayah;

-- Menghitung jarak antar fasilitas publik dgn ST_Distance
SELECT
a.nama as dari,
b.nama as ke,
ST_Distance(
a.geom,
b.geom
) as jarak_m
FROM fasilitas_publik a, fasilitas_publik b
WHERE a.nama = 'SMPN 19 Bandar Lampung'
AND b.nama = 'GBKP Runggun Bandar Lampung';

SELECT
a.nama as dari,
b.nama as ke,
ST_Distance(
a.geom::geography,
b.geom::geography
) as jarak_m
FROM fasilitas_publik a, fasilitas_publik b
WHERE a.nama = 'SMPN 19 Bandar Lampung'
AND b.nama = 'GBKP Runggun Bandar Lampung';

SELECT
a.nama as dari,
b.nama as ke,
ST_Distance(
ST_Transform(a.geom, 32748),
ST_Transform(b.geom, 32748)
) as jarak_m
FROM fasilitas_publik a, fasilitas_publik b
WHERE a.nama = 'SMPN 19 Bandar Lampung'
AND b.nama = 'GBKP Runggun Bandar Lampung';

-- Menghitung luas wilayah dgn ST_Area
SELECT
nama,
ST_Area(
geom
) as luas_m2,
ST_Area(
geom
) / 10000 as luas_ha
FROM wilayah
WHERE nama = 'Perumahan GMP';

SELECT
nama,
ST_Area(
geom::geography
) as luas_m2,
ST_Area(
geom::geography
) / 10000 as luas_ha
FROM wilayah
WHERE nama = 'Perumahan GMP';

SELECT
nama,
ST_Area(
ST_Transform(geom, 32748)
) as luas_m2,
ST_Area(
ST_Transform(geom, 32748)
) / 10000 as luas_ha
FROM wilayah
WHERE nama = 'Perumahan GMP';