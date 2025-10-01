import os
from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
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
    bg = models.ImageField(upload_to='images/', blank=True, null=True)
    profile = models.ImageField(upload_to='images/', blank=True, null=True)
    resume = models.FileField(upload_to='resume/', blank=True, null=True)

    def __str__(self):
        return self.text

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        # # Upload resume to Supabase if it exists
        # if self.resume and os.path.exists(self.resume.path):
        #     file_name = os.path.basename(self.resume.name)
        #     with open(self.resume.path, 'rb') as f:
        #         client.storage.from_('staticfiles').upload(
        #             f"resume/{file_name}",
        #             f.read(),
        #             {'content-type': 'application/pdf'}
        #         )

        # # Upload bg image to Supabase if it exists
        # if self.bg and os.path.exists(self.bg.path):
        #     file_name = os.path.basename(self.bg.name)
        #     with open(self.bg.path, 'rb') as f:
        #         content_type = 'image/jpeg' if file_name.lower().endswith(('.jpg', '.jpeg')) else 'image/png'
        #         client.storage.from_('staticfiles').upload(
        #             f"images/{file_name}",
        #             f.read(),
        #             {'content-type': content_type}
        #         )

        # # Upload profile image to Supabase if it exists
        # if self.profile and os.path.exists(self.profile.path):
        #     file_name = os.path.basename(self.profile.name)
        #     with open(self.profile.path, 'rb') as f:
        #         content_type = 'image/jpeg' if file_name.lower().endswith(('.jpg', '.jpeg')) else 'image/png'
        #         client.storage.from_('staticfiles').upload(
        #             f"images/{file_name}",
        #             f.read(),
        #             {'content-type': content_type}
        #         )

    @property
    def signed_resume_url(self):
        if not self.resume:
            return None
        file_name = os.path.basename(self.resume.name)
        try:
            result = client.storage.from_('staticfiles').create_signed_url(
                f"resume/{file_name}",
                3600  # 1 hour
            )
            return result['signedURL']
        except Exception as e:
            print(f"Error generating signed URL for resume: {e}")
            return None

    @property
    def signed_profile_url(self):
        if not self.profile:
            return None
        file_name = os.path.basename(self.profile.name)
        try:
            result = client.storage.from_('staticfiles').create_signed_url(
                f"images/{file_name}",
                3600
            )
            return result['signedURL']
        except Exception as e:
            print(f"Error generating signed URL for profile: {e}")
            return None

    @property
    def signed_bg_url(self):
        if not self.bg:
            return None
        file_name = os.path.basename(self.bg.name)
        try:
            result = client.storage.from_('staticfiles').create_signed_url(
                f"images/{file_name}",
                3600
            )
            return result['signedURL']
        except Exception as e:
            print(f"Error generating signed URL for bg: {e}")
            return None

class Certificate(models.Model):
    title = models.CharField(max_length=100)
    date = models.DateField()
    link = models.URLField(max_length=200, blank=True)

    def __str__(self):
        return self.title


class VisitorAnalytics(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField(blank=True, null=True)
    visited_at = models.DateTimeField(auto_now_add=True)
    session_key = models.CharField(max_length=40, blank=True, null=True)
    page_url = models.URLField(max_length=500, blank=True, null=True)
    referrer = models.URLField(max_length=500, blank=True, null=True)

    class Meta:
        verbose_name = "Visitor Analytics"
        verbose_name_plural = "Visitor Analytics"
        ordering = ['-visited_at']

    def __str__(self):
        if self.user:
            return f"{self.user.username} - {self.visited_at.strftime('%Y-%m-%d %H:%M')}"
        return f"Guest - {self.visited_at.strftime('%Y-%m-%d %H:%M')}"

    @property
    def visitor_name(self):
        if self.user:
            if self.user.get_full_name():
                return self.user.get_full_name()
            elif self.user.email:
                return self.user.email
            else:
                return self.user.username
        return "Guest"