from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import About, Project

@receiver(post_delete, sender=About)
def delete_about_files(sender, instance, **kwargs):
    if instance.image:
        instance.image.delete(False)
    if instance.cv:
        instance.cv.delete(False)

@receiver(post_delete, sender=Project)
def delete_project_files(sender, instance, **kwargs):
    if instance.image:
        instance.image.delete(False)