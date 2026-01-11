from rest_framework import viewsets
from ..models import PurchaseOrder
from ..serializers.purchase_order import PurchaseOrderSerializer

class PurchaseOrderViewSet(viewsets.ModelViewSet):
    queryset = PurchaseOrder.objects.all()
    serializer_class = PurchaseOrderSerializer