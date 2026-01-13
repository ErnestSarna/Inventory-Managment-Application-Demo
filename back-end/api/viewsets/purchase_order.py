from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from ..models import PurchaseOrder
from ..serializers.purchase_order import PurchaseOrderSerializer

class PurchaseOrderViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrder.objects.all()
    serializer_class = PurchaseOrderSerializer
    permission_classes = [IsAuthenticated]