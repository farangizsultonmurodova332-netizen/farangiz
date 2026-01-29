from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("chat", "0006_chatroom_groups"),
    ]

    operations = [
        migrations.AddField(
            model_name="chatroommembership",
            name="last_read_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
    ]
