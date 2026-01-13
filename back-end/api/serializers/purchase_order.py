from rest_framework import serializers
from ..models import PurchaseOrder, Vendor, Project
from .vendor import VendorSerializer
from .project import ProjectSerializer

class PurchaseOrderSerializer(serializers.ModelSerializer):
    vendor = VendorSerializer(read_only=True)
    project = ProjectSerializer(read_only=True)
    
    vendor_id = serializers.PrimaryKeyRelatedField(
        queryset=Vendor.objects.all(),
        write_only=True,
        source='vendor'
    )
    
    project_id = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(),
        write_only=True,
        source='project'
    )
    
    class Meta:
        model = PurchaseOrder
        fields = [
            "id",
            "order_number",
            "vendor",
            "vendor_id",
            "project",
            "project_id",
            "order_date",
            "total_amount",
            "status",
        ]
        read_only_fields = ["id"]