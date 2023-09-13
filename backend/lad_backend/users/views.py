from django.shortcuts import render
from .serializers import UserListSerializer, StatSerializer
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from rest_framework import status
from rest_framework.decorators import api_view
from .models import User
from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework_simplejwt.tokens import RefreshToken
from django.middleware import csrf
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework import serializers
import random

class UserList(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    ordering_fields = ('id', 'name', 'created')
    queryset = User.objects.all()
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    ordering = ('id')
    serializer_class = UserListSerializer
    ordering_fields = ['id', 'name', 'created']
    filterset_fields = ['admin', 'blocked', 'deleted']
    
    
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    def post(self, request, format=None):
        data = request.data
        response = Response()        
        username = data.get('username', None)
        password = data.get('password', None)
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                data = get_tokens_for_user(user)
                response.set_cookie(
                    key = settings.SIMPLE_JWT['AUTH_COOKIE'], 
                    value = data["access"],
                    expires = settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                    secure = settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                    httponly = settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                    samesite = settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
                )
                csrf.get_token(request)
                response.data = {"Success" : "Login successfully","data":data, "user": user.name}
                return response
            else:
                return Response({"No active" : "This account is not active!!"}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response({"Invalid" : "Invalid username or password!!"}, status=status.HTTP_404_NOT_FOUND)
            

class CheckLoginView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({"status": "OK"}, status = status.HTTP_200_OK)

class StatListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = StatSerializer

    def get_queryset(self):
        return User.objects.raw("select " + str(random.randint(0, 100)) + " as id, 'admin' as \"status\", count(*)  from users_user where admin=true UNION ALL select " + str(random.randint(0, 100)) + " as id, 'active' as \"status\", count(*) from users_user where blocked=false and deleted=false UNION ALL select " + str(random.randint(0, 100)) + " as id, 'blocked' as \"status\", count(*) from users_user where blocked=true and deleted=false UNION ALL select " + str(random.randint(0, 100)) + " as id, 'deleted' as \"status\", count(*) from users_user where deleted=true")

    def list(self, request):
        queryset = self.get_queryset()
        # the serializer didn't take my RawQuerySet, so made it into a list
        serializer = StatSerializer(list(queryset), many=True)
        print(serializer.data)
        return Response(serializer.data)


class UserDeleteView(generics.DestroyAPIView):
    queryset = User.objects.all()
    authentication_classes = []
    lookup_field = 'id'
    serializer_class = UserListSerializer
    def perform_destroy(self, instance):
        instance.deleted = True
        instance.save()
        
