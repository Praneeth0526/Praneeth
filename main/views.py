from django.shortcuts import render,get_object_or_404
from .models import Project,Tag
# Create your views here.

def home(request):
    projects = Project.objects.all()
    return render(request,'main/index.html',{'projects':projects})

def contact(request):
    return render(request,'contact.html')

def project(request, id):
    return render(request,'project.html')