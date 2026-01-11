from rest_framework import serializers
from ..models import Item
from .vendor import VendorSerializer
from .project import ProjectSerializer
from .location import LocationSerializer
from .purchase_order import PurchaseOrderSerializer

class InventoryItemSerializer(serializers.ModelSerializer):
    vendor = VendorSerializer(read_only=True)
    project = ProjectSerializer(read_only=True)
    location = LocationSerializer(read_only=True)
    purchase_order = PurchaseOrderSerializer(read_only=True)

    class Meta:
        model = Item
        fields = [
            'id',
            'name',
            'purchase_order',
            'tag_number',
            'description',
            'quantity',
            'vendor',
            'project',
            'price',
            'location',
            'comments',
        ]