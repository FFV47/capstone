import os
from pathlib import Path
from uuid import uuid4

from django.conf import settings

app_name = Path(__file__).resolve().parent.name


class FormErrors:
    fields: tuple[str]
    errors: list[str]

    def __init__(self, error_dict):
        self.fields = tuple(error_dict.keys())
        self.errors = [
            f"{key.title()}: {', '.join(value)}" for key, value in error_dict.items()
        ]


def form_errors_handler(error_dict: dict[str, list[str]] | None) -> FormErrors | None:
    if error_dict:
        return FormErrors(error_dict)


def upload_path(instance, filename):
    """
    file will be uploaded to MEDIA_ROOT/user_<id>/<random_filename>

    :param instance: An instance of the model where the FileField
    is defined. More specifically, this is the particular instance
    where the current file is being attached. In most cases, this
    object will not have been saved to the database yet, so if it uses
    the default AutoField, it might not yet have a value for its
    primary key field.

    :param filename: The filename that was originally given to the
    file. This may or may not be taken into account when determining
    the final destination path.
    """
    file_ext = os.path.splitext(filename)[1]
    user_id = instance.id if getattr(instance, "id", None) else instance.user_id
    return f"{app_name}/user_{user_id}/{uuid4().hex}{file_ext}"


def personal_account_path(instance, filename):
    return account_path_handler(instance, filename, "personal/")


def business_logo_path(instance, filename):
    return account_path_handler(instance, filename, "business/logo/")


def business_photo_path(instance, filename):
    return account_path_handler(instance, filename, "business/photo/")


def account_path_handler(instance, filename, extra_path):
    file_ext = os.path.splitext(filename)[1]
    path = f"{app_name}/user_{instance.user_id}/{extra_path}"

    # Remove old files
    for root, _, files in os.walk(settings.MEDIA_ROOT / path):
        for file in files:
            os.remove(os.path.join(root, file))

    return f"{path}{uuid4().hex}{file_ext}"
