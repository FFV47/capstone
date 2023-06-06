from os import path
from uuid import uuid4

app_name = path.basename(path.dirname(__file__))


class FormErrors:
    fields: tuple[str]
    errors: list[str]

    def __init__(self, error_dict):
        self.fields = tuple(error_dict.keys())
        self.errors = [f"{key.title()}: {', '.join(value)}" for key, value in error_dict.items()]


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
    file_ext = path.splitext(filename)[1]
    return f"{app_name}/user_{instance.id}/{uuid4().hex}{file_ext}"
