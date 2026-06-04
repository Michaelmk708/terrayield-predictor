# predictor/urls.py
from django.urls import path
from .views import predict_crops

urlpatterns = [
    path('predict/', predict_crops, name='predict_crops'),
]