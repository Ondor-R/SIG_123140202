--  buat spatial index
CREATE INDEX idx_rute_geom ON transportasi.rute USING GIST (geom)

CREATE INDEX idx_wilayah_geom ON transportasi.wilayah USING GIST (geom)

CREATE INDEX idx_halte_geom ON transportasi.halte USING GIST (geom)

-- cek indexing & query cepat
EXPLAIN ANALYZE
SELECT a.nama_rute AS nama_rute, b.nama AS nama_wilayah
FROM transportasi.rute a CROSS JOIN transportasi.wilayah b
WHERE ST_Dwithin(a.geom::geography, b.geom::geography, 500);

-- query lambat
EXPLAIN ANALYZE
SELECT a.nama_rute AS nama_rute, b.nama AS nama_wilayah
FROM transportasi.rute a CROSS JOIN transportasi.wilayah b
WHERE ST_Distance(a.geom::geography, b.geom::geography) < 500;

