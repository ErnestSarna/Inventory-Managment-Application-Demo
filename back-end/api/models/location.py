from django.db import models

class Location(models.Model):
    name = models.CharField(max_length=200)
    address = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name