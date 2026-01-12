from rest_framework import serializers
from ..models import CustomUser

class CustomUserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=5)

    class Meta:
        model = CustomUser
        fields = ["username", "email", "first_name", "last_name", "password"]

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email'),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            password=validated_data['password']
        )
        return user
