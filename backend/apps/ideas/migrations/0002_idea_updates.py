from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


def copy_description(apps, schema_editor):
    Idea = apps.get_model('ideas', 'Idea')
    for idea in Idea.objects.all():
        if not idea.full_description:
            idea.full_description = idea.description or ''
        if not idea.short_description:
            idea.short_description = (idea.description or '')[:280]
        idea.save(update_fields=['short_description', 'full_description'])


class Migration(migrations.Migration):
    dependencies = [
        ('ideas', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='idea',
            name='short_description',
            field=models.CharField(default='', max_length=280),
        ),
        migrations.AddField(
            model_name='idea',
            name='full_description',
            field=models.TextField(default=''),
        ),
        migrations.RunPython(copy_description, migrations.RunPython.noop),
        migrations.RemoveField(
            model_name='idea',
            name='description',
        ),
        migrations.CreateModel(
            name='IdeaLike',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('idea', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='likes', to='ideas.idea')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='idea_likes', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('idea', 'user')},
            },
        ),
    ]