from django.shortcuts import render,get_object_or_404
from .models import Project,Skill
# Create your views here.

def home(request):
    projects = Project.objects.all()
    skills = Skill.objects.all()
    return render(request,'main/index.html',{'projects':projects,'skills':skills})

# def contact(request):
#     return render(request,'contact.html')

# def project(request, id):
#     return render(request,'project.html')