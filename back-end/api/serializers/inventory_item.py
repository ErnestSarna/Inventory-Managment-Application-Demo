from rest_framework import serializers
from ..models import Item, Vendor, Location, Project, PurchaseOrder
from .vendor import VendorSerializer
from .project import ProjectSerializer
from .location import LocationSerializer
from .purchase_order import PurchaseOrderSerializer

class InventoryItemSerializer(serializers.ModelSerializer):
    vendor = VendorSerializer(read_only=True)
    project = ProjectSerializer(read_only=True)
    location = LocationSerializer(read_only=True)
    purchase_order = PurchaseOrderSerializer(read_only=True)
    
    vendor_id = serializers.PrimaryKeyRelatedField(
        queryset=Vendor.objects.all(),
        write_only=True,
        source='vendor',
        allow_null=True,
        required=False,
    )
    location_id = serializers.PrimaryKeyRelatedField(
        queryset=Location.objects.all(),
        write_only=True,
        source='location',
        allow_null=True,
        required=False,
    )
    purchase_order_id = serializers.PrimaryKeyRelatedField(
        queryset=PurchaseOrder.objects.all(),
        write_only=True,
        source='purchase_order',
        allow_null=True,
        required=False,
    )
    
    project = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(),
        required=True,
    )

    class Meta:
        model = Item
        fields = [
            'id',
            'name',
            'purchase_order',
            'purchase_order_id',
            'tag_number',
            'description',
            'quantity',
            'vendor',
            'vendor_id',
            'project',
            'price',
            'location',
            'location_id',
            'comments',
        ]
        read_only_fields = ['id']