from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.forms import JSONField

from solution import validators
from solution.utils import upload_path

file_validator = validators.FileValidator(
    max_size=3, content_types=("image/jpeg", "image/png")
)

if TYPE_CHECKING:
    from django.db.models.manager import RelatedManager


class User(AbstractUser):
    id: int

    personal_account: RelatedManager[PersonalAccount]
    business_account: RelatedManager[BusinessAccount]

    has_account = models.BooleanField(default=False)


class Role(models.Model):
    id: int

    professionals: RelatedManager[PersonalAccount]

    name = models.CharField(max_length=255)


class JobType(models.Model):
    id: int

    name = models.CharField(max_length=255)


class Shift(models.Model):
    id: int

    name = models.CharField(max_length=255)


class DaysSchedule(models.Model):
    id: int

    name = models.CharField(max_length=255)


class JobTag(models.Model):
    id: int

    name = models.CharField(max_length=255)


class PersonalAccount(models.Model):
    id: int

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="personal_account",
    )
    name = models.CharField(max_length=255)
    personal_photo = models.ImageField(
        blank=True,
        upload_to=upload_path,
        validators=[file_validator],
    )
    role_id: int
    role = models.ForeignKey(Role, on_delete=models.CASCADE, related_name="professionals")
    rating = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(5)])
    review_count = models.IntegerField(validators=[MinValueValidator(0)])
    jobs_done = models.IntegerField(validators=[MinValueValidator(0)])
    location = models.CharField(max_length=255)
    verified_id = models.BooleanField(default=False)
    driving_license = models.BooleanField(default=False)
    about = models.CharField(max_length=250, blank=True)
    last_update = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)


class BusinessAccount(models.Model):
    id: int

    company_logo = models.ImageField(
        blank=True,
        upload_to=upload_path,
        validators=[file_validator],
    )

    name = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    legal_name = models.CharField(max_length=255)
    industry = models.CharField(max_length=255)
    company_size = models.IntegerField(validators=[MinValueValidator(0)])
    location = models.CharField(max_length=255)
    company_url = models.URLField(blank=True)
    description = models.TextField(blank=True)

    company_rep = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="business_account",
    )

    personal_photo = models.ImageField(
        blank=True,
        upload_to=upload_path,
        validators=[file_validator],
    )
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    verified_id = models.BooleanField()

    last_update = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)


class Job(models.Model):
    work_schedules: RelatedManager[WorkSchedules]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    company_rep = models.CharField(max_length=255)
    company_name = models.CharField(max_length=255)
    company_description = models.TextField()
    description = models.TextField()
    location = models.CharField(max_length=255)
    types = models.JSONField(validators=[validators.validate_job_types])
    shifts = models.JSONField(validators=[validators.validate_shifts])
    responsibilities = models.JSONField(default=list)
    qualifications = models.JSONField(default=list)
    benefits = models.JSONField(default=list)
    min_salary = models.FloatField(validators=[MinValueValidator(0)])
    max_salary = models.FloatField(
        validators=[MinValueValidator(0), MaxValueValidator(1_000_000)]
    )
    period_salary = models.CharField(max_length=255)
    application_instructions = models.TextField()
    tags = models.JSONField(validators=[validators.validate_tags])
    posted_date = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.id} - {self.title}"


class WorkSchedules(models.Model):
    id: int

    job_id: int
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="work_schedules")
    schedules = JSONField(validators=[validators.validate_schedule])
    time_from = models.TimeField()
    time_to = models.TimeField()

    class Meta:
        verbose_name_plural = "Work Schedules"
