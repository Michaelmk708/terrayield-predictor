// Target your local Django backend
const API_BASE = 'http://127.0.0.1:8000/api';

export const fetchCropPrediction = async (lat, lon) => {
  try {
    const response = await fetch(`${API_BASE}/predict/?lat=${lat}&lon=${lon}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: Failed to fetch data`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Integration Error:", error);
    throw error;
  }
};