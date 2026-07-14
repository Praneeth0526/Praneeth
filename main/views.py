from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse, HttpResponse
from django.core.mail import send_mail
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from .models import Project, Skill, Topic, About, Certificate, Tag, VisitorAnalytics, Experience, ContactSubmission
import json

def api_portfolio(request):
    """API endpoint for Next.js frontend"""
    about = About.objects.first()
    projects = list(Project.objects.all().values('title', 'description', 'link'))
    
    # Get tags for projects
    for p, proj_obj in zip(projects, Project.objects.all()):
        p['tags'] = list(proj_obj.tags.values_list('name', flat=True))
        p['image'] = proj_obj.image.url if proj_obj.image else None
        
    certificates = list(Certificate.objects.all().order_by('-date').values('title', 'date', 'link'))
    skills = list(Skill.objects.all().values_list('topic', flat=True))
    
    experiences_queryset = Experience.objects.all()
    experiences = []
    for exp in experiences_queryset:
        experiences.append({
            'title': exp.title,
            'company': exp.company,
            'date': exp.date_range,
            'description': exp.description,
            'isImage': exp.is_image,
            'logo': exp.logo.url if exp.logo else None,
            'color': exp.color,
            'iconSvg': exp.icon_svg,
            'iconColor': exp.icon_color,
        })
    
    data = {
        'about': {
            'name': about.name if about else "Praneeth G",
            'role': about.role if about else "Software Engineer",
            'bio': about.bio if about else "Developer",
            'resume_url': about.signed_resume_url if about else None,
            'profile_image': about.signed_profile_url if about else None,
        },
        'projects': projects,
        'certificates': certificates,
        'skills': skills,
        'experiences': experiences,
    }
    return JsonResponse(data)

@csrf_exempt
@require_http_methods(["POST"])
def api_contact(request):
    try:
        data = json.loads(request.body)
        name = data.get('name')
        email = data.get('email')
        message = data.get('message')
        
        # Save to DB
        ContactSubmission.objects.create(name=name, email=email, message=message)
        
        # Note: Set up EMAIL settings in settings.py to actually send
        from django.core.mail import send_mail
        from django.conf import settings
        
        try:
            send_mail(
                f"New Portfolio Contact from {name}",
                f"Email: {email}\n\nMessage:\n{message}",
                settings.DEFAULT_FROM_EMAIL if hasattr(settings, 'DEFAULT_FROM_EMAIL') else 'noreply@portfolio.local',
                [settings.DEFAULT_FROM_EMAIL if hasattr(settings, 'DEFAULT_FROM_EMAIL') else 'connect.praneeth@proton.me'],
                fail_silently=True,
            )
        except Exception:
            pass # Ignore email failure if not configured
            
        return JsonResponse({'status': 'success'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
