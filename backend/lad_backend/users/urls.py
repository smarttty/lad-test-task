from . import views
from django.urls import path, include

urlpatterns = [
    path('users/<int:id>/', views.UserDeleteView.as_view()),
    path('users/', views.UserList.as_view()),
    path('login/', views.LoginView.as_view()),
    path('checkLogin/', views.CheckLoginView.as_view()),
    path('stat/', views.StatListView.as_view())
]