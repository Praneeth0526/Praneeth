from django.shortcuts import render,get_object_or_404
from .models import Project,Skill,Topic,About
# Create your views here.

def home(request):
    about = About.objects.all()
    projects = Project.objects.all()
    skills = Skill.objects.all()
    topics = Topic.objects.all()
    return render(request,'main/index.html',{'projects':projects,'skills':skills,'topics':topics,'about':about})

# def contact(request):
#     return render(request,'contact.html')

# def project(request, id):
#     return render(request,'project.html')