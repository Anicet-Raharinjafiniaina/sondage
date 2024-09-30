# Generated by Django 5.1 on 2024-09-25 08:36

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('questionnaire', '0004_questionnaireresult'),
    ]

    operations = [
        migrations.CreateModel(
            name='QuestionnaireDetail',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('obligatoire', models.BooleanField(default=0)),
                ('question', models.TextField(blank=True)),
                ('questionnaire', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='questionnaire.questionnaire')),
            ],
            options={
                'db_table': 'questionnaire_detail',
            },
        ),
    ]
