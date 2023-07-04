# Generated by Django 4.2.2 on 2023-06-18 19:42

import json

from django.db import migrations


def fill_db(apps, schema_editor):
    # We can't import the Person model directly as it may be a newer
    # version than this migration expects. We use the historical version.
    User = apps.get_model("solution", "User")
    Profession = apps.get_model("solution", "Profession")
    JobType = apps.get_model("solution", "JobType")
    Shift = apps.get_model("solution", "Shift")
    DaysSchedule = apps.get_model("solution", "DaysSchedule")
    JobTag = apps.get_model("solution", "JobTag")

    with open("db_json/db.json") as db:
        db_json = json.loads(db.read())
        profession_objs = [Profession(name=role) for role in db_json["roles"]]
        job_types = [JobType(name=job_type) for job_type in db_json["jobTypes"]]
        shifts = [Shift(name=shift) for shift in db_json["shifts"]]
        days_schedules = [
            DaysSchedule(name=days_schedule) for days_schedule in db_json["daysSchedule"]
        ]
        job_tags = [JobTag(name=job_tag) for job_tag in db_json["jobTags"]]

        Profession.objects.bulk_create(profession_objs)
        JobType.objects.bulk_create(job_types)
        Shift.objects.bulk_create(shifts)
        DaysSchedule.objects.bulk_create(days_schedules)
        JobTag.objects.bulk_create(job_tags)

    User.objects.create_superuser(username="fernando", email="fernando@me.com", password="123")  # type: ignore

    new_user = User()
    new_user.first_name = "John"
    new_user.last_name = "Doe"
    new_user.username = "johndoe"
    new_user.email = "john@me.com"
    new_user.password = "123"
    new_user.save()

    new_user = User()
    new_user.first_name = "Jane"
    new_user.last_name = "Doe"
    new_user.username = "janedoe"
    new_user.email = "jane@me.com"
    new_user.password = "123"
    new_user.save()


class Migration(migrations.Migration):
    dependencies = [
        ("solution", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(fill_db),
    ]
