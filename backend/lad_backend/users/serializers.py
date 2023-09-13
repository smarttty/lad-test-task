# users/serializers.py 
from rest_framework import serializers
from .models import User

      
class UserListSerializer(serializers.ModelSerializer):
    created = serializers.ReadOnlyField()
    class Meta(object):
        model = User
        fields = ('id', 'email', 'name',
                  'created', 'admin', 'blocked', 'deleted')
        
class StatSerializer(serializers.Serializer):
    status = serializers.CharField(max_length=128, required=True)
    count = serializers.IntegerField(required=True)

    class Meta:
        fields = ('status', 'count')