from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models import Vendor
from ..serializers.vendor import VendorSerializer

class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    permission_classes = [IsAuthenticated]