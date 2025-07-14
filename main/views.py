from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse, HttpResponse
from django.core.mail import send_mail
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Project, Skill, Topic, About, Certificate, Tag
import json

def home(request):
    """Main portfolio page - now includes all sections for smooth scrolling"""
    tags = Tag.objects.all()
    about = About.objects.all()
    projects = Project.objects.all()  # Load all projects for work section
    skills = Skill.objects.all()
    topics = Topic.objects.all()
    certificates = Certificate.objects.all().order_by('-date')  # Load all certificates
    
    context = {
        'projects': projects,
        'skills': skills,
        'topics': topics,
        'about': about,
        'certificates': certificates,
        'tags': tags
    }
    return render(request, 'main/index.html', context=context)

# HTMX Section Views
def home_section(request):
    """Return home section content"""
    about = About.objects.all()
    context = {'about': about}
    return render(request, 'main/sections/home.html', context)

def about_section(request):
    """Return about section content"""
    about = About.objects.all()
    context = {'about': about}
    return render(request, 'main/sections/about.html', context)

def work_section(request):
    """Return work/projects section content"""
    projects = Project.objects.all()[:6]  # Load first 6 projects
    context = {'projects': projects}
    return render(request, 'main/sections/work.html', context)

def certificate_section(request):
    """Return certificates section content"""
    certificates = Certificate.objects.all().order_by('-date')[:6]  # Load first 6 certificates
    context = {'certificates': certificates}
    return render(request, 'main/sections/certificates.html', context)

def contact_section(request):
    """Return contact section content"""
    return render(request, 'main/sections/contact.html')

# HTMX Detail Views
def project_detail(request, project_id):
    """Return project detail modal content"""
    project = get_object_or_404(Project, id=project_id)
    context = {'project': project}
    return render(request, 'main/modals/project_detail.html', context)
# HTMX Load More Views
def load_more_projects(request):
    """Load more projects via HTMX"""
    offset = int(request.GET.get('offset', 6))
    limit = 6
    projects = Project.objects.all()[offset:offset + limit]
    
    context = {
        'projects': projects,
        'offset': offset + limit
    }
    return render(request, 'main/partials/projects_list.html', context)

def load_more_certificates(request):
    """Load more certificates via HTMX"""
    offset = int(request.GET.get('offset', 6))
    limit = 6
    certificates = Certificate.objects.all().order_by('-date')[offset:offset + limit]
    
    context = {
        'certificates': certificates,
        'offset': offset + limit
    }
    return render(request, 'main/partials/certificates_list.html', context)
