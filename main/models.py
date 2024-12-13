from django.db import models
import uuid
from cloudinary.models import CloudinaryField

class Tag(models.Model):
    
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class Project(models.Model):
   
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=100)
    image = CloudinaryField('image',default='default.jpg')
    description = models.TextField(blank=True, null=True)
    tags = models.ManyToManyField(Tag,blank=True)  # Store tags as a comma-separated list
    link = models.URLField(max_length=200, blank=True)

    def __str__(self):
        return self.title

class Skill(models.Model):
    topic = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.topic

class Topic(models.Model):
    skill = models.ForeignKey(Skill, related_name='topics', on_delete=models.CASCADE)
    name = models.CharField(max_length=100, blank=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class About(models.Model):
    text = models.TextField()
    profile = CloudinaryField(
        'image',
        default='default.jpg',  # Specify your default image in Cloudinary
        blank=True,  # Allow empty uploads
    )
    bg = CloudinaryField(
        'image',
        default='default.jpg',  # Specify your default image in Cloudinary
        blank=True,  # Allow empty uploads
    )
    def __str__(self):
        return self.text

class Certificate(models.Model):
    title = models.CharField(max_length=100)
    date = models.DateField()
    link = models.URLField(max_length=200, blank=True)

    def __str__(self):
        return self.title