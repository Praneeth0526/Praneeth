from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import About, Project
import cloudinary.uploader

@receiver(post_delete, sender=About)
def delete_about_files(sender, instance, **kwargs):
    if instance.bg:
        instance.bg.delete(False)
    if instance.profile:
        instance.profile.delete(False)
    if instance.resume:
        instance.resume.delete(False)

@receiver(post_delete, sender=Project)
def delete_project_files(sender, instance, **kwargs):
    if instance.image and hasattr(instance.image, 'public_id'):
        # Be careful not to delete default Cloudinary assets if any
        cloudinary.uploader.destroy(instance.image.public_id)