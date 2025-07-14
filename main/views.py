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

def education_section(request):
    """Return education section content"""
    return render(request, 'main/sections/education.html')

def contact_section(request):
    """Return contact section content"""
    return render(request, 'main/sections/contact.html')

# HTMX Detail Views
def project_detail(request, project_id):
    """Return project detail modal content"""
    project = get_object_or_404(Project, id=project_id)
    context = {'project': project}
    return render(request, 'main/modals/project_detail.html', context)

def education_detail(request, level):
    """Return education detail content based on level"""
    context = {'level': level}
    
    if level == 'bachelor':
        context.update({
            'title': 'Bachelor Degree',
            'institution': 'Vidyavardhaka College of Engineering',
            'location': 'Mysuru, Karnataka',
            'course': 'B.E in Computer Science',
            'duration': '2023-2027',
            'description': 'Currently pursuing Bachelor of Engineering in Computer Science with focus on AI, Machine Learning, and Data Analytics.',
            'subjects': ['Data Structures', 'Algorithms', 'Machine Learning', 'Database Systems', 'Cloud']
        })
    elif level == 'preuniversity':
        context.update({
            'title': 'Pre-University Education',
            'institution': 'Gopal Swamy PU College (Sankalpa)',
            'location': 'Mysuru, Karnataka',
            'course': 'P.U.C',
            'duration': '2021-2023',
            'description': 'Completed Pre-University Course with focus on Science stream.',
            'subjects': ['Physics', 'Chemistry', 'Mathematics', 'Biology']
        })
    
    return render(request, 'main/partials/education_detail.html', context)

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

# HTMX Form Submission
@require_http_methods(["POST"])
def contact_submit(request):
    """Handle contact form submission via HTMX"""
    try:
        name = request.POST.get('name')
        email = request.POST.get('email')
        subject = request.POST.get('subject')
        message = request.POST.get('message')
        
        if not all([name, email, subject, message]):
            return render(request, 'main/partials/contact_response.html', {
                'status': 'error',
                'message': 'All fields are required.'
            })
        
        # Send email (configure your email settings)
        full_message = f"From: {name} ({email})\n\nMessage:\n{message}"
        
        try:
            send_mail(
                subject=f"Portfolio Contact: {subject}",
                message=full_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=['praneeth2578@gmail.com'],
                fail_silently=False,
            )
            
            return render(request, 'main/partials/contact_response.html', {
                'status': 'success',
                'message': 'Thank you for your message! I will get back to you soon.'
            })
            
        except Exception as e:
            return render(request, 'main/partials/contact_response.html', {
                'status': 'error',
                'message': 'Sorry, there was an error sending your message. Please try again later.'
            })
            
    except Exception as e:
        return render(request, 'main/partials/contact_response.html', {
            'status': 'error',
            'message': 'An unexpected error occurred. Please try again.'
        })

@require_http_methods(["POST"])
def contact(request):
    """Handle contact form submission and send email"""
    try:
        name = request.POST.get('name')
        email = request.POST.get('email')
        subject = request.POST.get('subject')
        message = request.POST.get('message')
        
        if not all([name, email, subject, message]):
            return JsonResponse({
                'success': False,
                'message': 'All fields are required.'
            })
        
        # Send email to praneeth2578@gmail.com
        full_message = f"""
New message from your portfolio website:

Name: {name}
Email: {email}
Subject: {subject}

Message:
{message}

---
This message was sent from your portfolio contact form.
Reply directly to: {email}
        """
        
        try:
            # Check if we're using console backend
            from django.conf import settings
            if settings.EMAIL_BACKEND == 'django.core.mail.backends.console.EmailBackend':
                print("=" * 50)
                print("EMAIL CONFIGURATION NEEDED!")
                print("=" * 50)
                print("The email is being printed here because you need to:")
                print("1. Create a .env file in your project root")
                print("2. Add your Gmail App Password")
                print("3. Restart the Django server")
                print("=" * 50)
                return JsonResponse({
                    'success': False,
                    'message': 'Email configuration needed. Check terminal for instructions.'
                })
            
            # Try to send the email
            result = send_mail(
                subject=f"Portfolio Contact: {subject}",
                message=full_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=['praneeth2578@gmail.com'],
                fail_silently=False,
            )
            
            if result:
                return JsonResponse({
                    'success': True,
                    'message': 'Thank you for your message! I will get back to you soon.'
                })
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Failed to send email. Please try again later.'
                })
            
        except Exception as e:
            print(f"Email sending error: {e}")  # For debugging
            error_message = str(e)
            
            if "authentication failed" in error_message.lower():
                return JsonResponse({
                    'success': False,
                    'message': 'Email authentication failed. Please check configuration.'
                })
            elif "connection" in error_message.lower():
                return JsonResponse({
                    'success': False,
                    'message': 'Unable to connect to email server. Please try again later.'
                })
            else:
                return JsonResponse({
                    'success': False,
                    'message': 'Sorry, there was an error sending your message. Please try again later.'
                })
            
    except Exception as e:
        print(f"Contact form error: {e}")  # For debugging
        return JsonResponse({
            'success': False,
            'message': 'An unexpected error occurred. Please try again.'
        })
