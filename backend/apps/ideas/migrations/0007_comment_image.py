from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('ideas', '0006_publiccomment'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='image',
            field=models.FileField(blank=True, null=True, upload_to='comment-images/'),
        ),
    ]
