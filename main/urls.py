from django.urls import path
from . import views

app_name = 'main'

urlpatterns = [
    # Next.js API
    path("api/portfolio/", views.api_portfolio, name="api_portfolio"),
    path("api/contact/", views.api_contact, name="api_contact"),
]


