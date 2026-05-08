import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, ZoomControl, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../services/api';

const MapView = ({ isAdmin }) => {
  const [geoData, setGeoData] = useState(null);
  const [aiData, setAiData] = useState(null); 

  useEffect(() => {
    window.hapusHalte = async (id) => {
      if(window.confirm("Yakin mau hapus halte ini dari database?")) {
        try {
          await api.delete(`/halte/${id}`); 
          alert("Data Halte berhasil dihapus!");
          window.location.reload(); 
        } catch (error) {
          alert("Gagal menghapus halte. Cek konsol.");
        }
      }
    };
    return () => { delete window.hapusHalte; };
  }, []);

  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        const response = await api.get('/api/halte/'); 
        setGeoData(response.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };
    fetchGeoJSON();
  }, []);

  useEffect(() => {
    fetch('/hasil_batch_14_gambar.geojson')
      .then(res => res.json())
      .then(data => setAiData(data))
      .catch(err => console.error(err));
  }, []);

  const pointToLayer = (feature, latlng) => {
    const jenis = feature.properties.jenis || 'bus'; 
    
    const customIcon = L.divIcon({
      className: 'custom-marker-transparent',
      html: `<div class="point ${jenis.toLowerCase()}"></div>`, 
      iconSize: [14, 14],
      iconAnchor: [7, 7],
      popupAnchor: [0, -10]
    });

    return L.marker(latlng, { icon: customIcon });
  };
  
  const onEachFeature = (feature, layer) => {
    if (feature.properties && feature.properties.nama) {
      const { id, nama, kode, jenis, alamat, fasilitas, kapasitas } = feature.properties;
      const jenisLower = jenis ? jenis.toLowerCase() : '';
      
      const bgBadge = jenisLower === 'brt' ? '#fee2e2' : jenisLower === 'bus' ? '#dbeafe' : '#d1fae5';
      const txtBadge = jenisLower === 'brt' ? '#ef4444' : jenisLower === 'bus' ? '#3b82f6' : '#10b981';

      const deleteButtonHtml = isAdmin ? `
        <div style="display: flex; gap: 5px; margin-top: 10px; border-top: 1px solid #e2e8f0; padding-top: 10px;">
            <button onclick="window.hapusHalte(${id})" style="flex: 1; background-color: #ef4444; color: white; border: none; padding: 8px; border-radius: 6px; cursor: pointer; font-weight: bold; transition: 0.2s;">
              Hapus Data
            </button>
        </div>
      ` : '';

      const fasilitasText = fasilitas ? (Array.isArray(fasilitas) ? fasilitas.join(' • ') : fasilitas) : '-';

      layer.bindPopup(`
        <div style="font-family: 'Monument Grotesk', 'Druk', 'Segoe UI', Tahoma, sans-serif; min-width: 240px; padding: 4px;">
          <h3 style="margin: 0 0 10px 0; color: #1e293b; font-size: 16px; font-weight: 800; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">
            ${nama}
          </h3>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span style="color: #64748b; font-size: 12px; font-weight: 600;">Kode: ${kode || '-'}</span>
            <span style="background: ${bgBadge}; color: ${txtBadge}; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase;">
              ${jenis}
            </span>
          </div>
          <div style="background: #f8fafc; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0; margin-bottom: 8px;">
            <span style="display: block; font-size: 10px; color: #94a3b8; font-weight: bold; margin-bottom: 4px; letter-spacing: 0.5px;">LOKASI</span>
            <p style="margin: 0; font-size: 12px; color: #334155; line-height: 1.4;">${alamat || '-'}</p>
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px; padding: 0 4px;">
             <p style="margin: 0; font-size: 12px; color: #475569;">👥 Kapasitas: <strong style="color: #0f172a;">${kapasitas || 0} Orang</strong></p>
             <div>
                <span style="font-size: 10px; color: #94a3b8; font-weight: bold;">FASILITAS:</span>
                <p style="margin: 2px 0 0 0; color: #64748b; font-style: italic; font-size: 11px;">${fasilitasText}</p>
             </div>
          </div>
          ${deleteButtonHtml}
        </div>
      `);
    }
  };

  const aiPointToLayer = (feature, latlng) => {
    const aiIcon = L.divIcon({
      className: 'custom-marker-transparent',
      html: `<div class="point ai-detect"></div>`, 
      iconSize: [14, 14],
      iconAnchor: [7, 7],
      popupAnchor: [0, -10]
    });
    return L.marker(latlng, { icon: aiIcon });
  };

  const aiOnEachFeature = (feature, layer) => {
    if (feature.properties) {
      layer.bindPopup(`
        <div style="font-family: 'Monument Grotesk', 'Druk', 'Segoe UI', Tahoma, sans-serif; text-align: center; padding: 5px;">
          <h4 style="margin: 0 0 8px 0; color: #09cc23; font-size: 15px;">🤖 Deteksi AI YOLOv8</h4>
          <p style="margin: 0 0 4px 0; font-size: 13px; color: #334155;"><strong>Objek:</strong> ${feature.properties.jenis}</p>
          <p style="margin: 0 0 4px 0; font-size: 13px; color: #334155;"><strong>Akurasi:</strong> <span style="color: #10b981; font-weight: bold;">${(feature.properties.confidence * 100).toFixed(1)}%</span></p>
        </div>
      `);
    }
  };

  return (
    <MapContainer 
      center={[-5.385, 105.26]} 
      zoom={13} 
      style={{ height: "100%", width: "100%", zIndex: 0 }}
      zoomControl={false} 
    >
      <ZoomControl position="topright" />

      <LayersControl position="topright">
        <LayersControl.BaseLayer name="Satelit (Esri)">
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer checked name="Peta Jalan (OSM)">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </LayersControl.BaseLayer>
      </LayersControl>

      {geoData && (
        <GeoJSON 
          key={`geo-${JSON.stringify(geoData)}`} 
          data={geoData} 
          pointToLayer={pointToLayer} 
          onEachFeature={onEachFeature} 
        />
      )}
      {aiData && (
        <GeoJSON 
          key={`ai-${JSON.stringify(aiData)}`}
          data={aiData} 
          pointToLayer={aiPointToLayer} 
          onEachFeature={aiOnEachFeature} 
        />
      )}
    </MapContainer>
  );
};

export default MapView;