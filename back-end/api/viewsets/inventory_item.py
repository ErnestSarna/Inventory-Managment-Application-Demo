from rest_framework import viewsets
from ..models import Item
from ..serializers.inventory_item import InventoryItemSerializer

class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = InventoryItemSerializer