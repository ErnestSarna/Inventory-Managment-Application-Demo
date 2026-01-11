from django.contrib import admin
from .models.user import CustomUser
from .models.project import Project
from .models.location import Location
from .models.vendor import Vendor
from .models.inventory_item import Item
from .models.purchase_order import PurchaseOrder

# Register your models here.
admin.site.register(CustomUser)
admin.site.register(Project)
admin.site.register(Location)
admin.site.register(Vendor)
admin.site.register(Item)
admin.site.register(PurchaseOrder)