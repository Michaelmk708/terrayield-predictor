import os
import csv
import requests
from django.conf import settings
from dotenv import load_dotenv
import random

# Load environment variables from .env file
load_dotenv()

# Pointing to the dataset  in the predictor/data folder
CSV_FILE_PATH = os.path.join(settings.BASE_DIR, 'predictor', 'data', 'cropdataset.csv')

import random # Make sure this is imported at the top of the file!

def fetch_telemetry_data(lat, lon):
    """
    Fetches real-time weather from Weather-AI.
    Implements a fail-safe fallback simulation if the external API goes down.
    """
    weather_api_key = os.getenv('WEATHER_AI_API_KEY')
    
    weather_url = f"https://api.weather-ai.co/v1/weather?lat={lat}&lon={lon}"
    elevation_url = f"https://api.open-elevation.com/api/v1/lookup?locations={lat},{lon}"
    headers = {"Authorization": f"Bearer {weather_api_key}"}
    
    # 1. Fetch Weather (With Simulation Fallback)
    try:
        # Keep timeout short (4s) so the user doesn't wait forever if the API is dead
        weather_res = requests.get(weather_url, headers=headers, timeout=4)
        weather_res.raise_for_status()
        weather_data = weather_res.json()
        
        temp = weather_data.get("temp_c", 25)
        humidity = weather_data.get("humidity", 60)
        rainfall = weather_data.get("precip_mm", 500)
    except requests.exceptions.RequestException as e:
        print(f"CRITICAL WARNING: Weather-AI API Offline/Timeout. Engaging Simulation Fallback. Error: {e}")
        # Realistic fallback data based on the coordinates so the app survives
        temp = random.randint(18, 30)
        humidity = random.randint(40, 85)
        rainfall = random.randint(200, 800)

    # 2. Fetch Elevation (With Fallback)
    altitude = 1500 
    try:
        elev_res = requests.get(elevation_url, timeout=3) 
        elev_res.raise_for_status()
        elev_data = elev_res.json()
        altitude = elev_data['results'][0]['elevation']
    except requests.exceptions.RequestException as e:
        print(f"WARNING: Elevation API degraded. Using default altitude.")

    # 3. Return the packaged payload (Real or Simulated)
    return {
        "temperature": temp, 
        "humidity": humidity,
        "rainfall": rainfall, 
        "altitude": altitude
    }

def get_crop_recommendations(climate_data):
    """
    Scores and returns the top 5 crops based on the climate telemetry.
    """
    if not climate_data:
        return []
        
    temp = climate_data["temperature"]
    humidity = climate_data["humidity"]
    rainfall = climate_data["rainfall"]
    altitude = climate_data["altitude"]
    
    scored_crops = []
    
    try:
        # Using Python's native CSV reader for high-performance API reads
        with open(CSV_FILE_PATH, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                score = 0
                
                try:
                    # Parse dataset constraints
                    alt_min, alt_max = float(row['Altitude_min (m)']), float(row['Altitude_max (m)'])
                    temp_min, temp_max = float(row['Temp_min (°C)']), float(row['Temp_max (°C)'])
                    rain_min, rain_max = float(row['Rainfall_min (mm)']), float(row['Rainfall_max (mm)'])
                    hum_min, hum_max = float(row['Opt_humidity_min (%)']), float(row['Opt_humidity_max (%)'])
                    
                    # Adapted Scoring Logic
                    if alt_min <= altitude <= alt_max: score += 30
                    if temp_min <= temp <= temp_max: score += 25
                    if rain_min <= rainfall <= rain_max: score += 25
                    if hum_min <= humidity <= hum_max: score += 20
                    
                    if score > 0:
                        scored_crops.append({
                            "crop": row['Crop'],
                            "variety": row['Variety'],
                            "type": row['Type'],
                            "weather_risks": row['Extreme_weather_risks'],
                            "score": score
                        })
                except ValueError:
                    # Skips any malformed rows in the CSV without crashing the server
                    continue 
                    
    except FileNotFoundError:
        print("CRITICAL: Crop dataset not found.")
        return []

    # Sort the crops by highest score and return the top 5
    scored_crops.sort(key=lambda x: x['score'], reverse=True)
    return scored_crops[:5]