
-- PRAKTIKUM 1
Buat tabel dengan struktur: id, nama, jenis, alamat, geom

minimal 5 (sekolah, masjid, puskesmas)

CREATE TABLE fasilitas_publik (
	id SERIAL PRIMARY KEY,
	nama VARCHAR(100) NOT NULL,
	jenis VARCHAR(100) NOT NULL,
	alamat TEXT,
	geom GEOMETRY(Point, 4326)
);

INSERT INTO fasilitas_publik (nama, jenis, alamat, geom)
VALUES
('SMPN 19 Bandar Lampung',
 'Sekolah',
 'Jl. Turi Raya No.1, Labuhan Dalam, Kec. Tj. Senang, Kota Bandar Lampung, Lampung 35141',
 ST_SETSRID(
   ST_MakePoint(105.2674, -5.3647),
   4326
 ));

INSERT INTO fasilitas_publik (nama, jenis, alamat, geom)
VALUES
('GBKP Runggun Bandar Lampung',
 'Gereja',
 'Jalan Turi Raya (By Pass KP) No.36, Tanjung Senang, Tj. Senang, Bandar Lampung, Kota Bandar Lampung, Lampung 35141',
 ST_SETSRID(
   ST_MakePoint(105.2688, -5.3627),
   4326
 ));

INSERT INTO fasilitas_publik (nama, jenis, alamat, geom)
VALUES
('Masjid An-Nahl',
 'Masjid',
 'J7QC+F26, Unnamed Road, Tj. Senang, Kec. Tj. Senang, Kota Bandar Lampung, Lampung 35141',
 ST_SETSRID(
   ST_MakePoint(105.2700, -5.3613),
   4326
 ));

INSERT INTO fasilitas_publik (nama, jenis, alamat, geom)
VALUES
('Gereja Katolik Santa Maria Immaculata',
 'Gereja',
 'Jl. Cempaka 4 No.3, Way Kandis, Kec. Tj. Senang, Kota Bandar Lampung, Lampung 35141',
 ST_SETSRID(
   ST_MakePoint(105.2889, -5.3534),
   4326
 ));

INSERT INTO fasilitas_publik (nama, jenis, alamat, geom)
VALUES
('RS. Airan Raya',
 'Rumah Sakit',
 'Jl. Airan Raya No.99, Way Hui, Kec. Jati Agung, Kabupaten Lampung Selatan, Lampung 35131',
 ST_SETSRID(
   ST_MakePoint(105.2980, -5.3507),
   4326
 ));

SELECT 
  nama, 
  ST_Distance(
    geom::geography,
    ST_SetSRID(
      ST_MakePoint(105.2703, -5.3607),
      4326
    )::geography
  ) / 1000 AS jarak_km
FROM fasilitas_publik
ORDER BY jarak_km;

SELECT
  nama,
  ST_AsText(
    ST_Buffer(
      geom::geography,
      5000
    )::geometry
  ) AS area
FROM fasilitas_publik;

-- PRAKTIKUM 2
CREATE TABLE jalan (
id SERIAL PRIMARY KEY,
nama VARCHAR(100),
geom GEOMETRY(LineString, 4326)
);

INSERT INTO jalan (nama, geom) VALUES
('Jl. Al Zaitun', ST_GeomFromText(
'LINESTRING(105.2687 -5.3605, 105.2693 -5.3621)', 4326));

INSERT INTO jalan (nama, geom) VALUES
('Jl. Kilas', ST_GeomFromText(
'LINESTRING(105.2722 -5.3591, 105.2724 -5.3595, 
105.2726 -5.3598, 105.2730 -5.3602)', 4326));

INSERT INTO jalan (nama, geom) VALUES
('Gg. Palem', ST_GeomFromText(
'LINESTRING(105.2673 -5.3624, 105.2673 -5.3630, 
105.2679 -5.3632, 105.2682 -5.3633)', 4326));

CREATE TABLE wilayah (
id SERIAL PRIMARY KEY,
nama VARCHAR(100),
geom GEOMETRY(Polygon, 4326)
);

INSERT INTO wilayah (nama, geom) VALUES
('Perumahan GMP', ST_GeomFromText(
'POLYGON((105.2697 -5.3585, 105.2714 -5.3594,
105.2729 -5.3618, 105.2693 -5.3626, 105.2697 -5.3585))', 4326));

INSERT INTO wilayah (nama, geom) VALUES
('Perumdam', ST_GeomFromText(
'POLYGON((105.2783 -5.3591, 105.2829 -5.3589, 105.2825 -5.3570, 
105.2802 -5.3562, 105.2779 -5.3553, 105.2773 -5.3573, 105.2783 -5.3591))', 4326));

SELECT
-- Geometry ke WKT
ST_AsText(geom) as wkt,
-- Geometry ke GeoJSON (untuk web)
ST_AsGeoJSON(geom) as geojson,
-- Ekstrak koordinat
ST_X(geom) as longitude,
ST_Y(geom) as latitude,
-- Cek SRID
ST_SRID(geom) as srid
FROM fasilitas_publik;


