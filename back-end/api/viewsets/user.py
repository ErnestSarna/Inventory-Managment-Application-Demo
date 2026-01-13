from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models import CustomUser
from ..serializers.user import CustomUserSerializer

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated]
