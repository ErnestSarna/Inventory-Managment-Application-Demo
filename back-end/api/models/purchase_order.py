from django.db import models
from .vendor import Vendor
from .project import Project

class PurchaseOrder(models.Model):
    order_number = models.CharField(max_length=100, unique=True)
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='purchase_orders', null=True, blank=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='purchase_orders', null=True, blank=True)
    order_date = models.DateField()
    total_amount = models.DecimalField(max_digits=20, decimal_places=2)
    status = models.CharField(max_length=50, default='Pending')

    def __str__(self):
        return self.order_number