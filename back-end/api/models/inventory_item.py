from django.db import models
from .project import Project
from .location import Location
from .vendor import Vendor
from.purchase_order import PurchaseOrder

class Item(models.Model):
    name = models.CharField(max_length=200)
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE, related_name='items', null=True, blank=True)
    tag_number = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    quantity = models.IntegerField()
    vendor = models.ForeignKey(Vendor, on_delete=models.CASCADE, related_name='items', null=True, blank=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='items', null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='items', null=True, blank=True)
    comments = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.tag_number