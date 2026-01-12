"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path, include

from rest_framework.routers import DefaultRouter
from .viewsets.user import CustomUserViewSet
from .viewsets.project import ProjectViewSet
from .viewsets.location import LocationViewSet
from .viewsets.vendor import VendorViewSet
from .viewsets.inventory_item import InventoryItemViewSet
from .viewsets.purchase_order import PurchaseOrderViewSet
from .viewsets.register import RegisterAPIView

from .views import login_view

router = DefaultRouter()
router.register(r"users", CustomUserViewSet)
router.register(r"projects", ProjectViewSet)
router.register(r"locations", LocationViewSet)
router.register(r"vendors", VendorViewSet)
router.register(r"inventory_items", InventoryItemViewSet)
router.register(r"purchase_orders", PurchaseOrderViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path("register/", RegisterAPIView.as_view(), name="api-register"),
    path('auth/login/', login_view),
]