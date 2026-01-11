from django.db import models

class Vendor(models.Model):
    name = models.CharField(max_length=200)
    contact_email = models.EmailField(max_length=100, unique=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name