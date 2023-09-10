# users/serializers.py 
from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    created = serializers.ReadOnlyField()
    class Meta(object):
        model = User
        fields = ('id', 'email', 'name',
                  'created', 'password')
        extra_kwargs = {'password': {'write_only': True}}