from rest_framework import serializers
from ..models import PurchaseOrder
from .vendor import VendorSerializer
from .project import ProjectSerializer

class PurchaseOrderSerializer(serializers.ModelSerializer):
    vendor = VendorSerializer(read_only=True)
    project = ProjectSerializer(read_only=True)
    
    class Meta:
        model = PurchaseOrder
        fields = [
            "id",
            "order_number",
            "vendor",
            "project",
            "order_date",
            "total_amount",
            "status",
        ]
        read_only_fields = ["id"]