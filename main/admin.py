from django.contrib import admin
from .models import Project, Tag, Skill, Topic,About,Certificate,Contact

# Inline for Project Images
# class ProjectImageInline(admin.TabularInline):
#     model = ProjectImage
#     extra = 1  # Number of empty forms to display

class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'link', 'slug','image')  # Added slug for better visibility
    search_fields = ('title', 'description')
    list_filter = ('tags',)
    prepopulated_fields = {'slug': ('title',)}  # Automatically populate slug from title

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

class AboutAdmin(admin.ModelAdmin):
    list_display = ('text', 'image', 'cv')
    search_fields = ('text',)



# Register models with the admin site
admin.site.register(Tag, TagAdmin)
admin.site.register(Project, ProjectAdmin)
admin.site.register(Skill, SkillAdmin)
admin.site.register(Topic)
admin.site.register(About, AboutAdmin)
admin.site.register(Certificate)
admin.site.register(Contact)