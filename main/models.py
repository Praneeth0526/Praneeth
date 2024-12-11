from django.db import models
import uuid

class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Project(models.Model):
    title = models.CharField(max_length=100)
    image = models.ImageField(null=True)
    description = models.TextField()
    tags = models.ManyToManyField(Tag, related_name='projects')
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    link = models.URLField(max_length=200, blank=True)
    #id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)

    def __str__(self):
        return self.title

# class ProjectImage(models.Model):
#     project = models.ForeignKey(Project, related_name='images', on_delete=models.CASCADE)
#     image = models.ImageField(upload_to='project_images/')

#     def __str__(self):
#         return f"{self.project.title} Image"

# class Skill(models.Model):
#     name = models.CharField(max_length=100, unique=True)
#     description = models.TextField(blank=True)

#     def __str__(self):
#         return self.name

class Skill(models.Model):
    topic = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.topic

class Topic(models.Model):
    skill = models.ForeignKey(Skill, related_name='topics', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name