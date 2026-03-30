SELECT ST_Union(ST_Buffer(geom::geography, 500)::geometry) as buffer_500m FROM transportasi.halte;

SELECT ST_Union(ST_Buffer(geom::geography, 1000)::geometry) as buffer_1km FROM pertanian.hama_penyakit WHERE status = 'terkendali';

SELECT a.nama AS halte,
       b.nama AS daerah,
       ST_Area(ST_Intersection(ST_Buffer(
	a.geom::geography, 500)::geometry,
	b.geom)::geography) AS intersection_area_m2
FROM transportasi.halte a, transportasi.wilayah b
WHERE ST_Intersects(ST_Buffer(a.geom::geography, 500)::geometry, b.geom);

SELECT a.nama_pemilik, a.jenis_tanaman, a.luas_hektar,
	   b.nama_hama_penyakit, b.tingkat_serangan
FROM pertanian.lahan a JOIN pertanian.hama_penyakit b ON ST_Intersects(a.geom, ST_Buffer(b.geom::geography, 500)::geometry) ORDER BY a.nama_pemilik;

SELECT nama as daerah, ST_AsText(ST_Centroid(geom)) AS centroid FROM transportasi.wilayah;

SELECT jenis_tanaman, ST_AsText(ST_Envelope(ST_Collect(geom))) AS bounding_box FROM pertanian.lahan GROUP BY jenis_tanaman;
