from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("chat", "0007_membership_last_read_at"),
    ]

    operations = [
        migrations.AddField(
            model_name="message",
            name="is_edited",
            field=models.BooleanField(default=False),
        ),
    ]
