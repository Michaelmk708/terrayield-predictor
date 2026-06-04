import React, { useState } from 'react';
import { fetchCropPrediction } from '../services/api';

const KENYAN_REGIONS = [
  { id: 'baringo', name: "Baringo", lat: 0.4667, lon: 35.9833 },
  { id: 'bomet', name: "Bomet", lat: -0.7813, lon: 35.3416 },
  { id: 'bungoma', name: "Bungoma", lat: 0.5635, lon: 34.5606 },
  { id: 'busia', name: "Busia", lat: 0.4608, lon: 34.1115 },
  { id: 'elgeyo-marakwet', name: "Elgeyo-Marakwet", lat: 0.8000, lon: 35.5333 },
  { id: 'embu', name: "Embu", lat: -0.5311, lon: 37.4506 },
  { id: 'garissa', name: "Garissa", lat: -0.4532, lon: 39.6461 },
  { id: 'homa-bay', name: "Homa Bay", lat: -0.5273, lon: 34.4571 },
  { id: 'isiolo', name: "Isiolo", lat: 0.3522, lon: 37.5833 },
  { id: 'kajiado', name: "Kajiado", lat: -2.0981, lon: 36.7820 },
  { id: 'kakamega', name: "Kakamega", lat: 0.2827, lon: 34.7519 },
  { id: 'kericho', name: "Kericho", lat: -0.3692, lon: 35.2839 },
  { id: 'kiambu', name: "Kiambu", lat: -1.1667, lon: 36.8333 },
  { id: 'kilifi', name: "Kilifi", lat: -3.5107, lon: 39.9093 },
  { id: 'kirinyaga', name: "Kirinyaga", lat: -0.5000, lon: 37.2833 },
  { id: 'kisii', name: "Kisii", lat: -0.6773, lon: 34.7796 },
  { id: 'kisumu', name: "Kisumu", lat: -0.1022, lon: 34.7617 },
  { id: 'kitui', name: "Kitui", lat: -1.3733, lon: 38.0106 },
  { id: 'kwale', name: "Kwale", lat: -4.1816, lon: 39.4606 },
  { id: 'laikipia', name: "Laikipia", lat: 0.3667, lon: 36.9667 },
  { id: 'lamu', name: "Lamu", lat: -2.2717, lon: 40.9020 },
  { id: 'machakos', name: "Machakos", lat: -1.5177, lon: 37.2634 },
  { id: 'makueni', name: "Makueni", lat: -1.8041, lon: 37.6203 },
  { id: 'mandera', name: "Mandera", lat: 3.9373, lon: 41.8629 },
  { id: 'marsabit', name: "Marsabit", lat: 2.3369, lon: 37.9904 },
  { id: 'meru', name: "Meru", lat: 0.0463, lon: 37.6559 },
  { id: 'migori', name: "Migori", lat: -1.0664, lon: 34.4731 },
  { id: 'mombasa', name: "Mombasa", lat: -4.0435, lon: 39.6682 },
  { id: 'muranga', name: "Murang'a", lat: -0.7167, lon: 37.1500 },
  { id: 'nairobi', name: "Nairobi", lat: -1.2921, lon: 36.8219 },
  { id: 'nakuru', name: "Nakuru", lat: -0.3000, lon: 36.0667 },
  { id: 'nandi', name: "Nandi", lat: 0.1667, lon: 35.1000 },
  { id: 'narok', name: "Narok", lat: -1.0833, lon: 35.8667 },
  { id: 'nyamira', name: "Nyamira", lat: -0.5632, lon: 34.9358 },
  { id: 'nyandarua', name: "Nyandarua", lat: -0.5333, lon: 36.3833 },
  { id: 'nyeri', name: "Nyeri", lat: -0.4167, lon: 36.9500 },
  { id: 'samburu', name: "Samburu", lat: 1.2167, lon: 36.9833 },
  { id: 'siaya', name: "Siaya", lat: 0.0626, lon: 34.2878 },
  { id: 'taita-taveta', name: "Taita Taveta", lat: -3.3161, lon: 38.4850 },
  { id: 'tana-river', name: "Tana River", lat: -1.4336, lon: 40.0224 },
  { id: 'tharaka-nithi', name: "Tharaka-Nithi", lat: -0.3308, lon: 37.9655 },
  { id: 'trans-nzoia', name: "Trans-Nzoia", lat: 1.0500, lon: 35.0000 },
  { id: 'turkana', name: "Turkana", lat: 3.1167, lon: 35.6000 },
  { id: 'uasin-gishu', name: "Uasin Gishu", lat: 0.5167, lon: 35.2833 },
  { id: 'vihiga', name: "Vihiga", lat: 0.0823, lon: 34.7225 },
  { id: 'wajir', name: "Wajir", lat: 1.7471, lon: 40.0573 },
  { id: 'west-pokot', name: "West Pokot", lat: 1.2333, lon: 35.1167 }
];

export default function PredictorWorkspace() {
  const [selectedRegionId, setSelectedRegionId] = useState(KENYAN_REGIONS[0].id);
  const [customLat, setCustomLat] = useState("");
  const [customLon, setCustomLon] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const handleRegionChange = (e) => {
    setSelectedRegionId(e.target.value);
    // Clear any previous errors if they switch modes
    setError(null); 
  };

  const handlePredict = async () => {
    setLoading(true);
    setError(null);
    setResults(null); // Clear previous results while loading new ones

    let targetLat, targetLon;

    // Determine which coordinates to send to Django
    if (selectedRegionId === 'custom') {
      if (!customLat || !customLon) {
        setError("Please provide both Latitude and Longitude values.");
        setLoading(false);
        return;
      }
      targetLat = customLat;
      targetLon = customLon;
    } else {
      const region = KENYAN_REGIONS.find(r => r.id === selectedRegionId);
      targetLat = region.lat;
      targetLon = region.lon;
    }

    try {
      const data = await fetchCropPrediction(targetLat, targetLon);
      setResults(data);
    } catch (err) {
      setError("Failed to connect to the prediction engine. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Control Panel */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transition-all duration-300">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Run Prediction Model</h2>
        
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-600 mb-2">Select Agricultural Zone</label>
            <select 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all bg-white"
              value={selectedRegionId}
              onChange={handleRegionChange}
            >
              {KENYAN_REGIONS.map(region => (
                <option key={region.id} value={region.id}>
                  {region.name} (Lat: {region.lat}, Lon: {region.lon})
                </option>
              ))}
              <option value="custom" className="font-bold text-green-700">
                + Enter Custom Coordinates
              </option>
            </select>
          </div>
          
          <button 
            onClick={handlePredict}
            disabled={loading}
            className="w-full md:w-auto px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 h-[50px]"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processing...
              </>
            ) : "Generate Prediction"}
          </button>
        </div>

        {/* Expandable Manual Entry Fields */}
        {selectedRegionId === 'custom' && (
          <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Latitude</label>
              <input 
                type="number" 
                step="any"
                placeholder="e.g. -1.2921"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                value={customLat}
                onChange={(e) => setCustomLat(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">Longitude</label>
              <input 
                type="number" 
                step="any"
                placeholder="e.g. 36.8219"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 outline-none"
                value={customLon}
                onChange={(e) => setCustomLon(e.target.value)}
              />
            </div>
          </div>
        )}

        {error && <p className="text-red-500 mt-4 text-sm font-medium">{error}</p>}
      </div>

      {/* Results Display */}
      {results && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {/* Telemetry Dashboard */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Live Climate Telemetry</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <p className="text-sm text-blue-600 font-medium">Temperature</p>
                <p className="text-2xl font-bold text-blue-900">{results.telemetry.temperature}°C</p>
              </div>
              <div className="bg-cyan-50 p-4 rounded-xl border border-cyan-100">
                <p className="text-sm text-cyan-600 font-medium">Humidity</p>
                <p className="text-2xl font-bold text-cyan-900">{results.telemetry.humidity}%</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
                <p className="text-sm text-indigo-600 font-medium">Est. Rainfall</p>
                <p className="text-2xl font-bold text-indigo-900">{results.telemetry.rainfall} mm</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-sm text-slate-600 font-medium">Altitude</p>
                <p className="text-2xl font-bold text-slate-900">{results.telemetry.altitude} m</p>
              </div>
            </div>
          </div>

          {/* AI Crop Recommendations */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">Optimal Crop Varieties</h3>
            {results.recommendations.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.recommendations.map((item, index) => (
                  <div key={index} className="bg-white p-5 rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow hover:border-green-300">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-bold text-green-800">{item.crop}</h4>
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">Score: {item.score}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4"><span className="font-semibold">Variety:</span> {item.variety} ({item.type})</p>
                    <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                      <p className="text-xs text-orange-800 font-medium flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        Risk Factor: {item.weather_risks}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-200 text-center">
                <p className="text-yellow-800 font-medium">No suitable crops found for these extreme conditions.</p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}