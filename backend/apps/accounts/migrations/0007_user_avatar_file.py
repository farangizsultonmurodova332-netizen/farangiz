from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('accounts', '0006_password_reset_otp'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='avatar_file',
            field=models.FileField(blank=True, null=True, upload_to='avatars/'),
        ),
    ]
