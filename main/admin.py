
from django.contrib import admin
from .models import Project, Skill, Topic, About, Certificate, Tag


class AboutAdmin(admin.ModelAdmin):
    list_display = ('text', 'has_resume')
    
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

# Register Models in Admin Panel
admin.site.register(Tag, TagAdmin)
admin.site.register(Project, ProjectAdmin)
admin.site.register(Skill, SkillAdmin)
admin.site.register(Topic)
admin.site.register(About, AboutAdmin)
admin.site.register(Certificate)
