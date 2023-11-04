from __future__ import annotations

import uuid
from typing import TYPE_CHECKING

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.utils.translation import gettext_lazy as _

from django.core import validators
from django.db import models
from django.forms import JSONField

from solution import validators as app_validators

from solution.utils import business_logo_path, business_photo_path, personal_account_path

file_validator = app_validators.FileValidator(max_size=3, content_types=("image/jpeg", "image/png"))

if TYPE_CHECKING:
    from django.db.models import Manager


class User(AbstractUser):
    id: int

    personal_account: Manager[WorkerAccount]
    business_account: Manager[EmployerAccount]

    has_personal_account = models.BooleanField(default=False)
    has_business_account = models.BooleanField(default=False)


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

    professionals: Manager[WorkerAccount]

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


class WorkerAccount(BaseModel):
    applied_jobs: Manager[Job]
    jobs: Manager[Job]
    received_feedbacks: Manager[EmployerFeedback]
    job_feedbacks: Manager[WorkerFeedback]
    signed_contracts: Manager[Contract]

    user_id: int
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="personal_account",
        primary_key=True,
    )
    photo = models.ImageField(
        blank=True, upload_to=personal_account_path, validators=[file_validator]
    )
    profession_id: int
    profession = models.ForeignKey(
        to=Profession, on_delete=models.CASCADE, related_name="professionals"
    )
    first_name = models.CharField(max_length=20, validators=[validators.MinLengthValidator(2)])
    last_name = models.CharField(max_length=20, validators=[validators.MinLengthValidator(2)])
    birthdate = models.DateField(validators=[app_validators.validate_birthdate])
    phone = models.CharField(
        max_length=20, validators=[validators.RegexValidator(r"^(\d{1,3})(\d{2})(\d{9})$")]
    )
    rating = models.IntegerField(
        default=0, validators=[validators.MinValueValidator(0), validators.MaxValueValidator(5)]
    )
    location = models.CharField(max_length=50)
    about = models.CharField(blank=True, max_length=255)
    verified_id = models.BooleanField(default=False)
    driving_license = models.BooleanField(default=False)
    last_update = models.DateTimeField(auto_now=True)

    @property
    def review_count(self) -> int:
        return self.received_feedbacks.count()

    @property
    def jobs_done(self) -> int:
        return self.jobs.filter(done=True).count()

    def __repr__(self) -> str:
        return f"{self.user_id} - {self.profession}"


class EmployerAccount(BaseModel):
    worker_feedbacks: Manager[EmployerFeedback]
    received_feedbacks: Manager[WorkerFeedback]
    contracts: Manager[Contract]

    class CompanySize(models.IntegerChoices):
        MICRO = 0, _("Fewer than 10 employees")
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
    logo = models.ImageField(blank=True, upload_to=business_logo_path, validators=[file_validator])
    company_name = models.CharField(max_length=50)
    address = models.CharField(max_length=255)
    legal_name = models.CharField(max_length=100)
    industry = models.CharField(max_length=50)
    company_size = models.IntegerField(choices=CompanySize.choices)
    location = models.CharField(max_length=50)
    company_url = models.URLField(blank=True)
    description = models.TextField(blank=True)

    personal_photo = models.ImageField(
        blank=True, upload_to=business_photo_path, validators=[file_validator]
    )
    role = models.CharField(max_length=50)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone = models.CharField(
        max_length=20, validators=[validators.RegexValidator(r"^(\d{1,3})(\d{2})(\d{9})$")]
    )
    verified_id = models.BooleanField(default=False)
    last_update = models.DateTimeField(auto_now=True)

    def __repr__(self) -> str:
        return f"{self.user_id} - {self.company_name} - {self.role}"


class Job(BaseModel):
    work_schedules: Manager[WorkSchedules]
    employer_feedbacks: Manager[EmployerFeedback]
    worker_feedbacks: Manager[WorkerFeedback]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    title = models.CharField(max_length=255)
    employer = models.ForeignKey(
        to=EmployerAccount, on_delete=models.SET_NULL, null=True, related_name="jobs"
    )
    start_date = models.DateField()
    end_date = models.DateField(blank=True)
    description = models.TextField()
    location = models.CharField(max_length=255)
    types = models.JSONField(validators=[app_validators.validate_job_types])
    shifts = models.JSONField(validators=[app_validators.validate_shifts])
    responsibilities = models.JSONField(default=list)
    qualifications = models.JSONField(default=list)
    benefits = models.JSONField(default=list)
    min_salary = models.FloatField(validators=[validators.MinValueValidator(0)])
    max_salary = models.FloatField(
        validators=[validators.MinValueValidator(0), validators.MaxValueValidator(100_000)]
    )
    period_salary = models.CharField(max_length=255)
    application_instructions = models.TextField()
    tags = models.JSONField(validators=[app_validators.validate_tags])
    applicants = models.ManyToManyField(to=WorkerAccount, related_name="applied_jobs")
    workers = models.ManyToManyField(to=WorkerAccount, related_name="jobs")
    posted_date = models.DateTimeField(auto_now_add=True)

    def __repr__(self) -> str:
        return f"{self.id} - {self.title}"


class Contract(BaseModel):
    class Status(models.TextChoices):
        PENDING = "PEN", _("Pending")
        ACTIVE = "ACT", _("Active")
        ENDED = "END", _("Ended")
        TERMINATED = "TER", _("Terminated")
        REJECTED = "REJ", _("Rejected")

    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    start_date = models.DateField()
    end_date = models.DateField(blank=True)
    status = models.TextField(choices=Status.choices, default=Status.PENDING)
    signed_employer = models.ForeignKey(
        to=EmployerAccount, on_delete=models.SET_NULL, null=True, related_name="contracts"
    )
    signed_workers = models.ManyToManyField(
        to=WorkerAccount, related_name="signed_contracts", blank=True
    )


class FeedBack(BaseModel):
    class Meta:
        abstract = True

    rating = models.IntegerField(
        validators=[validators.MinValueValidator(0), validators.MaxValueValidator(5)]
    )
    text = models.TextField()


class EmployerFeedback(FeedBack):
    class Meta:
        constraints = [models.UniqueConstraint(fields=["job", "worker"], name="employer_feedback")]

    employer_id: int
    employer = models.ForeignKey(
        to=EmployerAccount, on_delete=models.SET_NULL, null=True, related_name="worker_feedbacks"
    )
    worker_id: int
    worker = models.ForeignKey(
        to=WorkerAccount, on_delete=models.SET_NULL, null=True, related_name="received_feedbacks"
    )
    job_id: int
    job = models.ForeignKey(
        to=Job, on_delete=models.SET_NULL, null=True, related_name="employer_feedbacks"
    )


class WorkerFeedback(FeedBack):
    class Meta:
        constraints = [models.UniqueConstraint(fields=["job", "employer"], name="worker_feedback")]

    worker_id: int
    worker = models.ForeignKey(
        to=WorkerAccount, on_delete=models.SET_NULL, null=True, related_name="job_feedbacks"
    )
    employer_id: int
    employer = models.ForeignKey(
        to=EmployerAccount, on_delete=models.SET_NULL, null=True, related_name="received_feedbacks"
    )
    job_id: int
    job = models.ForeignKey(
        to=Job, on_delete=models.SET_NULL, null=True, related_name="worker_feedbacks"
    )


class WorkSchedules(BaseModel):
    class Meta:
        verbose_name_plural = "Work Schedules"

    id: int

    job_id: int
    job = models.ForeignKey(to=Job, on_delete=models.CASCADE, related_name="work_schedules")
    schedules = JSONField(validators=[app_validators.validate_schedule])
    time_from = models.TimeField()
    time_to = models.TimeField()

    def __repr__(self) -> str:
        return f"{self.job_id} - {self.schedules}"
