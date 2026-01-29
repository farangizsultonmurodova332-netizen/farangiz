from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("chat", "0003_message_image"),
    ]

    operations = [
        migrations.AddField(
            model_name="message",
            name="audio",
            field=models.FileField(blank=True, null=True, upload_to="chat-audio/"),
        ),
    ]
