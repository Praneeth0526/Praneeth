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
    
    # HTMX detail endpoints
    path("project/<uuid:project_id>/", views.project_detail, name="project_detail"),
    
    # HTMX load more endpoints
    path("load-more/projects/", views.load_more_projects, name="load_more_projects"),
    path("load-more/certificates/", views.load_more_certificates, name="load_more_certificates"),
    
]


