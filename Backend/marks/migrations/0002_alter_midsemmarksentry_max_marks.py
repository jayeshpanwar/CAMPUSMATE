from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('marks', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='midsemmarksentry',
            name='max_marks',
            field=models.FloatField(default=20.0),
        ),
    ]