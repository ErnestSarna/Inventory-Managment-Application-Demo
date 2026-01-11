from rest_framework import serializers
from ..models import Project
from .user import CustomUserSerializer

class ProjectSerializer(serializers.ModelSerializer):
    proj_engineer = CustomUserSerializer(read_only=True)
    
    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "description",
            "start_date",
            "end_date",
            "proj_engineer",
        ]
        read_only_fields = ["id"]