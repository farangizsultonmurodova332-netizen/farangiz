from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("ideas", "0006_publiccomment"),
    ]

    operations = [
        migrations.AddField(
            model_name="comment",
            name="is_pinned",
            field=models.BooleanField(db_index=True, default=False),
        ),
    ]
