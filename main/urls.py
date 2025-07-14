from django.urls import path
from . import views

app_name = 'main'

urlpatterns = [
    path("", views.home, name="home"),
    path("home/", views.home, name="home"),
    
    # HTMX section endpoints
    path("sections/home/", views.home_section, name="home_section"),
    path("sections/about/", views.about_section, name="about_section"),
    path("sections/work/", views.work_section, name="work_section"),
    path("sections/certificates/", views.certificate_section, name="certificate_section"),
    path("sections/education/", views.education_section, name="education_section"),
    path("sections/contact/", views.contact_section, name="contact_section"),
    
    # HTMX detail endpoints
    path("project/<uuid:project_id>/", views.project_detail, name="project_detail"),
    path("education/<str:level>/", views.education_detail, name="education_detail"),
    
    # HTMX load more endpoints
    path("load-more/projects/", views.load_more_projects, name="load_more_projects"),
    path("load-more/certificates/", views.load_more_certificates, name="load_more_certificates"),
    
    # HTMX form submission
    path("contact/submit/", views.contact_submit, name="contact_submit"),
    path("contact/", views.contact, name="contact"),
]


