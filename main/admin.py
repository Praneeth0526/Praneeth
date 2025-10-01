
from django.contrib import admin
from django.db.models import Count
from django.utils.html import format_html
from django.urls import path, reverse
from django.shortcuts import render
from django.http import HttpResponse
from datetime import datetime, timedelta
from .models import Project, Skill, Topic, About, Certificate, Tag, VisitorAnalytics


class UserTypeFilter(admin.SimpleListFilter):
    title = 'visitor type'
    parameter_name = 'visitor_type'

    def lookups(self, request, model_admin):
        return (
            ('registered', 'Registered Users'),
            ('guest', 'Guests'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'registered':
            return queryset.filter(user__isnull=False)
        if self.value() == 'guest':
            return queryset.filter(user__isnull=True)


class AboutAdmin(admin.ModelAdmin):
    list_display = ('text', 'profile','bg', 'has_resume')
    
    def has_resume(self, obj):
        return bool(obj.resume)
    has_resume.boolean = True
 
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'link', 'image')
    search_fields = ('title', 'description')
    list_filter = ('tags',)

class TagAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

class TopicInline(admin.TabularInline):
    model = Topic
    extra = 1  # Number of empty forms to display

class SkillAdmin(admin.ModelAdmin):
    list_display = ('topic',)
    search_fields = ('topic',)
    inlines = [TopicInline]

class VisitorAnalyticsAdmin(admin.ModelAdmin):
    list_display = ('visitor_display', 'ip_address', 'visited_at', 'page_url_short', 'user_agent_short')
    list_filter = ('visited_at', UserTypeFilter)
    search_fields = ('user__username', 'user__email', 'ip_address', 'page_url')
    readonly_fields = ('visitor_display', 'ip_address', 'user_agent', 'visited_at', 'session_key', 'page_url', 'referrer')
    date_hierarchy = 'visited_at'
    ordering = ['-visited_at']
    
    def visitor_display(self, obj):
        """Display visitor name with colored badge for user type"""
        if obj.user:
            return format_html(
                '<span style="background-color: #28a745; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">{}</span>',
                obj.visitor_name
            )
        return format_html(
            '<span style="background-color: #6c757d; color: white; padding: 2px 8px; border-radius: 12px; font-size: 11px;">Guest</span>'
        )
    visitor_display.short_description = 'Visitor'
    visitor_display.admin_order_field = 'user'
    
    def page_url_short(self, obj):
        """Display shortened page URL"""
        if obj.page_url and len(obj.page_url) > 50:
            return obj.page_url[:47] + '...'
        return obj.page_url or '-'
    page_url_short.short_description = 'Page URL'
    
    def user_agent_short(self, obj):
        """Display shortened user agent"""
        if obj.user_agent and len(obj.user_agent) > 40:
            return obj.user_agent[:37] + '...'
        return obj.user_agent or '-'
    user_agent_short.short_description = 'User Agent'
    
    def get_urls(self):
        """Add custom URLs for analytics dashboard"""
        urls = super().get_urls()
        custom_urls = [
            path('analytics-dashboard/', self.analytics_dashboard_view, name='visitor-analytics-dashboard'),
        ]
        return custom_urls + urls
    
    def analytics_dashboard_view(self, request):
        """Custom view for analytics dashboard"""
        # Get total visits
        total_visits = VisitorAnalytics.objects.count()
        
        # Get unique visitors (by IP address)
        unique_visitors = VisitorAnalytics.objects.values('ip_address').distinct().count()
        
        # Get registered users visits
        registered_visits = VisitorAnalytics.objects.filter(user__isnull=False).count()
        
        # Get guest visits
        guest_visits = VisitorAnalytics.objects.filter(user__isnull=True).count()
        
        # Get visits in last 7 days
        last_week = datetime.now() - timedelta(days=7)
        visits_last_week = VisitorAnalytics.objects.filter(visited_at__gte=last_week).count()
        
        # Get visits in last 24 hours
        last_24h = datetime.now() - timedelta(hours=24)
        visits_last_24h = VisitorAnalytics.objects.filter(visited_at__gte=last_24h).count()
        
        # Get top pages
        top_pages = VisitorAnalytics.objects.values('page_url').annotate(
            visit_count=Count('id')
        ).order_by('-visit_count')[:10]
        
        # Get recent visitors
        recent_visitors = VisitorAnalytics.objects.select_related('user').order_by('-visited_at')[:20]
        
        context = {
            'title': 'Visitor Analytics Dashboard',
            'total_visits': total_visits,
            'unique_visitors': unique_visitors,
            'registered_visits': registered_visits,
            'guest_visits': guest_visits,
            'visits_last_week': visits_last_week,
            'visits_last_24h': visits_last_24h,
            'top_pages': top_pages,
            'recent_visitors': recent_visitors,
        }
        
        return render(request, 'admin/visitor_analytics_dashboard.html', context)
    
    def changelist_view(self, request, extra_context=None):
        """Override changelist to add dashboard link"""
        extra_context = extra_context or {}
        extra_context['dashboard_url'] = reverse('admin:visitor-analytics-dashboard')
        return super().changelist_view(request, extra_context)


# Register Models in Admin Panel
admin.site.register(Tag, TagAdmin)
admin.site.register(Project, ProjectAdmin)
admin.site.register(Skill, SkillAdmin)
admin.site.register(Topic)
admin.site.register(About, AboutAdmin)
admin.site.register(Certificate)
admin.site.register(VisitorAnalytics, VisitorAnalyticsAdmin)
