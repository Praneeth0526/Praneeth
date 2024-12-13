from django.db import models
import uuid

class Tag(models.Model):
    
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class Project(models.Model):
   
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=100)
    image = models.ImageField(null=True)
    description = models.TextField(blank=True, null=True)
    tags = models.ManyToManyField(Tag,blank=True, null=True)  # Store tags as a comma-separated list
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
    image = models.ImageField(null=True)
    cv = models.FileField(upload_to='cv/',null=True)

    def __str__(self):
        return self.text

class Certificate(models.Model):
    title = models.CharField(max_length=100)
    date = models.DateField()
    link = models.URLField(max_length=200, blank=True)

    def __str__(self):
        return self.title