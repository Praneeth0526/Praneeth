# Generated by Django 5.1.3 on 2024-12-13 14:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='project',
            name='tags',
        ),
        migrations.DeleteModel(
            name='Tag',
        ),
        migrations.AddField(
            model_name='project',
            name='tags',
            field=models.TextField(blank=True, null=True),
        ),
    ]
