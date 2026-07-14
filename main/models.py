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
    name = models.CharField(max_length=100, default="Your Name")
    role = models.CharField(max_length=100, default="Developer")
    bio = models.TextField(default="I'm a passionate developer...")
    text = models.TextField()
    bg = models.ImageField(upload_to='images/', blank=True, null=True)
    profile = models.ImageField(upload_to='images/', blank=True, null=True)
    resume = models.FileField(upload_to='resume/', blank=True, null=True)

    def __str__(self):
        return self.name if self.name else self.text

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
class Experience(models.Model):
    title = models.CharField(max_length=100)
    company = models.CharField(max_length=100)
    date_range = models.CharField(max_length=50)
    description = models.TextField(blank=True, null=True)
    is_image = models.BooleanField(default=False)
    logo = models.ImageField(upload_to='images/', blank=True, null=True)
    color = models.CharField(max_length=50, default="#e0e7ff", help_text="Hex color for background")
    icon_svg = models.TextField(blank=True, null=True, help_text="SVG code for icon if not using image")
    icon_color = models.CharField(max_length=50, blank=True, null=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.title} at {self.company}"

class ContactSubmission(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message from {self.name}"
