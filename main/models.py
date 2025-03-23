import os
from django.db import models
from django.conf import settings
import uuid
from cloudinary.models import CloudinaryField
from supabase import create_client
client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)


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
    profile = CloudinaryField('image', default='default.jpg', blank=True)
    bg = CloudinaryField('image', default='default.jpg', blank=True)
    resume = models.FileField(upload_to='resume/', blank=True, null=True)
    
    def __str__(self):
        return self.text
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        
        # Upload to Supabase if resume exists
        if self.resume:
           
            file_name = os.path.basename(self.resume.name)
            
            with open(self.resume.path, 'rb') as f:
                client.storage.from_('staticfiles').upload(
                    f"resume/{file_name}", 
                    f.read(),
                    {'content-type': 'application/pdf'}
                )
    
    @property
    def signed_resume_url(self):
        if not self.resume:
            return None
        
        file_name = os.path.basename(self.resume.name)
        
        result = client.storage.from_('staticfiles').create_signed_url(
            f"resume/{file_name}", 
            3600 # 1 hour
        )
        
        return result['signedURL']

class Certificate(models.Model):
    title = models.CharField(max_length=100)
    date = models.DateField()
    link = models.URLField(max_length=200, blank=True)

    def __str__(self):
        return self.title