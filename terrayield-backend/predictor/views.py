from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .services import fetch_telemetry_data, get_crop_recommendations

@api_view(['GET'])
def predict_crops(request):
    """
    API Endpoint: /api/predict/?lat=<latitude>&lon=<longitude>
    """
    # 1. Grab coordinates from the frontend request
    lat = request.GET.get('lat')
    lon = request.GET.get('lon')

    if not lat or not lon:
        return Response(
            {"error": "Please provide both 'lat' and 'lon' parameters."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # 2. Fetch the telemetry data (Weather & Elevation)
    telemetry_data = fetch_telemetry_data(lat, lon)
    
    if not telemetry_data:
        return Response(
            {"error": "Failed to retrieve telemetry data from external APIs."},
            status=status.HTTP_503_SERVICE_UNAVAILABLE
        )

    # 3. Calculate the recommendations based on the data
    recommendations = get_crop_recommendations(telemetry_data)

    # 4. Send the complete package back to React
    payload = {
        "telemetry": telemetry_data,
        "recommendations": recommendations
    }

    return Response(payload, status=status.HTTP_200_OK)