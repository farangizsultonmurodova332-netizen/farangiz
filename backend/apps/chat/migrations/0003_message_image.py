from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('chat', '0002_rename_chat_chatro_updated_e5c7e5_idx_chat_chatro_updated_fe8347_idx_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='image',
            field=models.FileField(blank=True, null=True, upload_to='chat-images/'),
        ),
    ]
