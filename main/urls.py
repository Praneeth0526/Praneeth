from django.urls import path
from . import views

app_name = 'main'

urlpatterns = [
    # Next.js API — both slash variants to avoid APPEND_SLASH redirects on serverless
    path("api/portfolio/", views.api_portfolio, name="api_portfolio"),
    path("api/portfolio", views.api_portfolio, name="api_portfolio_ns"),
    path("api/contact/", views.api_contact, name="api_contact"),
    path("api/contact", views.api_contact, name="api_contact_ns"),
]
