from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models import Item
from ..serializers.inventory_item import InventoryItemSerializer

class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = InventoryItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Item.objects.all()
        project_id = self.request.query_params.get('project')
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        return queryset