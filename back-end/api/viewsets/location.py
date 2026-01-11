from rest_framework import viewsets
from ..models import Location
from ..serializers.location import LocationSerializer

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer