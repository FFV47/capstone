from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.core.validators import (
    MaxValueValidator,
    MinLengthValidator,
    MinValueValidator,
    RegexValidator,
)
from django.db import models
from django.forms import JSONField

from solution import validators
from solution.utils import (
    business_logo_path,
    business_photo_path,
    personal_account_path,
    upload_path,
)

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


class BaseModel(models.Model):
    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self) -> str:
        return self.__repr__()


class Profession(BaseModel):
    id: int

    professionals: RelatedManager[PersonalAccount]

    name = models.CharField(max_length=255)

    def __repr__(self) -> str:
        return f"{self.name}"


class JobType(BaseModel):
    id: int

    name = models.CharField(max_length=255)

    def __repr__(self) -> str:
        return f"{self.name}"


class Shift(BaseModel):
    id: int

    name = models.CharField(max_length=255)

    def __repr__(self) -> str:
        return f"{self.name}"


class DaysSchedule(BaseModel):
    id: int

    name = models.CharField(max_length=255)

    def __repr__(self) -> str:
        return f"{self.name}"


class JobTag(BaseModel):
    id: int

    name = models.CharField(max_length=255)

    def __repr__(self) -> str:
        return f"{self.name}"


class PersonalAccount(BaseModel):
    user_id: int
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="personal_account",
        primary_key=True,
    )
    photo = models.ImageField(
        blank=True,
        upload_to=personal_account_path,
        validators=[file_validator],
    )
    profession_id: int
    profession = models.ForeignKey(
        Profession, on_delete=models.CASCADE, related_name="professionals"
    )
    first_name = models.CharField(max_length=20, validators=[MinLengthValidator(2)])
    last_name = models.CharField(max_length=20, validators=[MinLengthValidator(2)])
    birthdate = models.DateField(validators=[validators.validate_birthdate])
    phone = models.CharField(
        max_length=20, validators=[RegexValidator(r"^(\d{1,3})(\d{2})(\d{9})$")]
    )
    rating = models.IntegerField(
        default=0, validators=[MinValueValidator(0), MaxValueValidator(5)]
    )
    location = models.CharField(max_length=50)
    about = models.CharField(
        blank=True,
        max_length=255,
    )
    review_count = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    jobs_done = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    verified_id = models.BooleanField(default=False)
    driving_license = models.BooleanField(default=False)
    last_update = models.DateTimeField(auto_now=True)

    def __repr__(self) -> str:
        return f"{self.user_id} - {self.profession}"


class BusinessAccount(BaseModel):
    class CompanySize(models.IntegerChoices):
        MICRO = 0, "Fewer than 10 employees"
        SMALL = 1, "10 to 50 employees"
        MEDIUM = 2, "50 to 250 employees"
        LARGE = 3, "250 to 500 employees"
        ENTERPRISE = 4, "More than 500 employees"

    user_id: int
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="business_account",
        primary_key=True,
    )
    logo = models.ImageField(
        blank=True,
        upload_to=business_logo_path,
        validators=[file_validator],
    )
    company_name = models.CharField(max_length=50)
    address = models.CharField(max_length=255)
    legal_name = models.CharField(max_length=100)
    industry = models.CharField(max_length=50)
    company_size = models.IntegerField(choices=CompanySize.choices)
    location = models.CharField(max_length=50)
    company_url = models.URLField(blank=True)
    description = models.TextField(blank=True)

    personal_photo = models.ImageField(
        blank=True,
        upload_to=business_photo_path,
        validators=[file_validator],
    )
    role = models.CharField(max_length=50)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone = models.CharField(
        max_length=20, validators=[RegexValidator(r"^(\d{1,3})(\d{2})(\d{9})$")]
    )
    verified_id = models.BooleanField(default=False)
    last_update = models.DateTimeField(auto_now=True)

    def __repr__(self) -> str:
        return f"{self.user_id} - {self.company_name} - {self.role}"


class Job(BaseModel):
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

    def __repr__(self):
        return f"{self.id} - {self.title}"


class WorkSchedules(BaseModel):
    class Meta:
        verbose_name_plural = "Work Schedules"

    id: int

    job_id: int
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="work_schedules")
    schedules = JSONField(validators=[validators.validate_schedule])
    time_from = models.TimeField()
    time_to = models.TimeField()

    def __repr__(self) -> str:
        return f"{self.job_id} - {self.schedules}"
