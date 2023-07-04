import datetime
import re

import magic
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.template.defaultfilters import filesizeformat
from django.utils.deconstruct import deconstructible
from django.utils.translation import gettext_lazy as _

JOB_TYPES = ["Part-Time", "Full-Time", "Overtime", "Contract", "Internship"]
SHIFTS = [
    "Day Shift",
    "Night Shift",
    "Overnight Shift",
    "4 Hour Shift",
    "8 Hour Shift",
    "12 Hour Shift",
    "24 Hour Shift",
]
SCHEDULE = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
    "Monday to Friday",
    "Weekend",
    "Whole Week",
]
TAGS = ["Hiring multiple candidates", "Urgently hiring", "Temporary"]


def validate_job_types(values: list[str]):
    for job_type in values:
        if job_type not in JOB_TYPES:
            raise ValidationError(
                _(f"{job_type} is not a valid job type"), code="invalid_job_type"
            )


def validate_shifts(values: list[str]):
    for shift in values:
        if shift not in SHIFTS:
            raise ValidationError(
                _(f"{shift} is not a valid shift"), code="invalid_shift"
            )


def validate_schedule(values: list[str]):
    for schedule in values:
        if schedule not in SCHEDULE:
            raise ValidationError(
                _(f"{schedule} is not a valid schedule"), code="invalid_schedule"
            )


def validate_tags(values: list[str]):
    for tag in values:
        if tag not in TAGS:
            raise ValidationError(_(f"{tag} is not a valid tag"), code="invalid_tag")


def validate_birthdate(value: datetime.date):
    current_date = datetime.date.today()
    age = current_date.year - value.year

    # Check if the birthday hasn't occurred yet this year
    if current_date.month < value.month or (
        current_date.month == value.month and current_date.day < value.day
    ):
        age -= 1

    if age > 80:
        raise ValidationError(
            _("Your age is %(age)s. Too old."),
            params={"age": age},
        )

    if age < 18:
        raise ValidationError(
            _("Your age is %(age)s. Too young."),
            params={"age": age},
        )


@deconstructible
class UsernameEmailValidator:
    username = ""

    def __init__(self, username=None) -> None:
        if username is not None:
            self.username = username

    def __call__(self, value) -> None:
        if "@" in value:
            validate_email(value)
        else:
            match = re.search(
                r"^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$",
                value,
                re.I | re.M,
            )

            if match is None:
                raise ValidationError(
                    _("Enter a valid username."), code="invalid_username"
                )

    def __eq__(self, other) -> bool:
        return (
            isinstance(other, UsernameEmailValidator) and self.username == other.username
        )


# https://docs.djangoproject.com/en/4.0/ref/validators/
# You can also use a class with a __call__() method for more complex
# or configurable validators. RegexValidator, for example, uses this
# technique. If a class-based validator is used in the validators
# model field option, you should make sure it is serializable by the
# migration framework by adding deconstruct() and __eq__() methods.
@deconstructible
class FileValidator:
    error_messages = {
        "max_size": _(
            "File size must not be greater than %(max_size)s. Your file size is %(size)s."
        ),
        "min_size": _(
            "File size must not be less than %(min_size)s. Your file size is %(size)s."
        ),
        "content_type": _("File of type %(content_type)s are not supported."),
    }

    def __init__(self, max_size=None, min_size=None, content_types=None):
        self.max_size = max_size * 1024 * 1024 if max_size is not None else None
        self.min_size = min_size * 1024 * 1024 if min_size is not None else None
        self.content_types = content_types

    def __call__(self, file):
        if self.max_size is not None and file.size > self.max_size:
            params = {
                "max_size": filesizeformat(self.max_size),
                "size": filesizeformat(file.size),
            }
            raise ValidationError(
                message=self.error_messages["max_size"],
                code="max_size",
                params=params,
            )

        if self.min_size is not None and file.size < self.min_size:
            params = {
                "min_size": filesizeformat(self.min_size),
                "size": filesizeformat(file.size),
            }
            raise ValidationError(
                message=self.error_messages["min_size"], code="min_size", params=params
            )

        if self.content_types is not None:
            content_type = magic.from_buffer(file.read(), mime=True)
            file.seek(0)

            if content_type not in self.content_types:
                params = {"content_type": content_type}
                raise ValidationError(
                    message=self.error_messages["content_type"],
                    code="content_type",
                    params=params,
                )

        return file

    def __eq__(self, other):
        return (
            isinstance(other, FileValidator)
            and self.max_size == other.max_size
            and self.min_size == other.min_size
            and self.content_types == other.content_types
        )
