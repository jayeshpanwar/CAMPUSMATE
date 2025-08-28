from django.db import models

# Create your models here.
# testapp/models.py

from django.db import models

class TestModel(models.Model):
    name = models.CharField(max_length=100)