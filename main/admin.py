from django.contrib import admin
from .models import Project, Tag, Skill, ProjectImage

# Inline for Project Images
class ProjectImageInline(admin.TabularInline):
    model = ProjectImage
    extra = 1  # Number of empty forms to display

class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'link', 'slug')  # Added slug for better visibility
    inlines = [ProjectImageInline]
    search_fields = ('title', 'description')
    list_filter = ('tags',)
    prepopulated_fields = {'slug': ('title',)}  # Automatically populate slug from title

class TagAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

class SkillAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

# Register models with the admin site
admin.site.register(Tag, TagAdmin)
admin.site.register(Project, ProjectAdmin)
admin.site.register(Skill, SkillAdmin)