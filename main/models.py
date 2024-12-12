from django.db import models

class Tag(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Project(models.Model):
    title = models.CharField(max_length=100)
    image = models.ImageField(null=True)
    description = models.TextField()
    tags = models.ManyToManyField(Tag, related_name='projects')
    link = models.URLField(max_length=200, blank=True)
    #id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)

    def __str__(self):
        return self.title


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
    name = models.CharField(max_length=100,blank=True)
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
    
# class Contact(models.Model):
#     name = models.CharField(max_length=100)
#     subject = models.CharField(max_length=100)
#     message = models.TextField()


#     def __str__(self):
#         return self.name