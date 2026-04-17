import SigMap from './SigMap'
import './App.css'

function App() {
  return (
    <div className="app-container">
      <header className="header">
        <h1>WebGIS Halte Bandar Lampung</h1>
        <p>Reyhan Oktavian Putra | 123140202 | Praktikum 8 SIG</p>
      </header>
      
      <main className="map_wrapper">
        <SigMap />
        <div className="map_legend">
          <h4>Legends:</h4>
          <div className="legend_ingfo">
            <span className="point point_brt"></span> Halte BRT
          </div>
          <div className="legend_ingfo">
            <span className="point point_bus"></span> Halte Bus Reguler
          </div>
          <div className="legend_ingfo">
            <span className="point point_angkot"></span> Halte Angkutan Kota
          </div>
        </div>
      </main>
    </div>
  )
}

export default App