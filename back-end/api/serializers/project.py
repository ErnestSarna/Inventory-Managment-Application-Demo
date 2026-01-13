from rest_framework import serializers
from ..models import Project, CustomUser
from .user import CustomUserSerializer

class ProjectSerializer(serializers.ModelSerializer):
    proj_engineer = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(),
        write_only=False,
    )
    
    proj_engineer_details = CustomUserSerializer(
        source='proj_engineer',
        read_only=True,
    )
    
    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "description",
            "start_date",
            "end_date",
            "proj_engineer",
            "proj_engineer_details",
        ]
        read_only_fields = ["id"]