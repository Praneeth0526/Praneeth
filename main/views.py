from django.shortcuts import render, redirect
from .models import Project, Skill, Topic, About, Certificate,Tag
# from .forms import ContactForm

def home(request):
    tags = Tag.objects.all()
    about = About.objects.all()
    projects = Project.objects.all()
    skills = Skill.objects.all()
    topics = Topic.objects.all()
    certificates = Certificate.objects.all().order_by('-date')
    context =  {
        'projects': projects,
        'skills': skills,
        'topics': topics,
        'about': about,
        'certificates': certificates,
        'tags':tags
    }

    return render(request, 'main/index.html', context=context)

