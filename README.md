M# TERRAYIELD 
**Weather-AI Integration Assessment**

[![Live Deployment](https://img.shields.io/badge/Live_Deployment-View_Project-brightgreen?style=for-the-badge)](https://terrayieldpredictor.netlify.app/)

## Overview
Terrayield is a high-performance, full-stack Crop Predictor platform. It ingests real-time climate telemetry (temperature, humidity, and rainfall) from the **Weather-AI API** and cross-references it with regional altitude data to dynamically recommend optimal crop varieties for Kenyan agricultural zones.

This project was built to demonstrate rapid problem-solving velocity, clean API consumption, and fault-tolerant systems architecture.

## Architectural Approach

When integrating third-party APIs into critical paths, network latency and external downtime are the biggest risks to scale. To address this, the backend was designed with strict defensive programming principles:

* **Decoupled Service Layer:** Business logic (data scoring and API fetching) is entirely abstracted from the Django routing layer. This keeps the controllers lightweight and the logic highly testable.
* **The "Circuit Breaker" Fallback:** If the primary Weather-AI API experiences a timeout or 503 error, the system does not crash. It catches the exception, logs a critical warning, and instantly engages a realistic mock-telemetry generator based on regional averages. This ensures the frontend UI always receives a valid 200 OK response.
* **Graceful Degradation:** The secondary Open-Elevation API is treated as a non-critical enhancement. If it fails, the system logs a warning, falls back to a default baseline altitude (1500m), and proceeds with the crop prediction without interrupting the user experience.
* **High-Speed Data Ingestion:** To optimize API response times, the crop dataset is parsed using Python's native `csv` module rather than heavy data-science libraries like Pandas, reducing overhead and resulting in sub-millisecond local processing.

## Tech Stack
* **Frontend:** React (Vite), Tailwind CSS
* **Backend:** Python, Django REST Framework
* **External APIs:** Weather-AI (Core Telemetry), Open-Elevation (Topography)

---

## Local Setup Instructions

### 1. The Backend (Django API)
Navigate to the backend directory and set up your virtual environment:

```bash
cd terrayield-backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
Install the minimal dependencies:

Bash


pip install django djangorestframework requests python-dotenv django-cors-headers
Configure your environment variables:
Create a .env file in the root backend directory and add your Weather-AI key:

Code snippet


WEATHER_AI_API_KEY=wai_your_key_here
Start the server:

Bash


python manage.py runserver
The API will be available at http://127.0.0.1:8000/api/predict/

2. The Frontend (React / Vite)
Open a new terminal window, navigate to the frontend directory, and install dependencies:

Bash


cd frontend
npm install
Start the Vite development server:

Bash


npm run dev
The UI will be available at http://localhost:5173

Built by Michael Kinuthia