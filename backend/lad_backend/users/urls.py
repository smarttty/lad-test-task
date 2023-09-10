from .views import CreateUserAPIView
from django.urls import path, include

urlpatterns = [
    path('create', CreateUserAPIView.as_view()),
]