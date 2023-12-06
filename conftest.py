import datetime
import io
import os

import pytest
from PIL import Image
from django.conf import settings
from rest_framework.test import APIClient

from solution.models import User


@pytest.fixture(autouse=True)
def whitenoise_autorefresh(settings):
    """
    Get rid of whitenoise "No directory at" warning, as it's not helpful when running tests.

    Related:
        - https://github.com/evansd/whitenoise/issues/215
        - https://github.com/evansd/whitenoise/issues/191
        - https://github.com/evansd/whitenoise/commit/4204494d44213f7a51229de8bc224cf6d84c01eb
    """
    settings.WHITENOISE_AUTOREFRESH = True


@pytest.fixture(scope="class")
def get_image_file(request):
    def function(request):
        file = io.BytesIO()
        image = Image.new("RGBA", size=(100, 100), color=(155, 0, 0))
        image.save(file, "png")
        file.name = "test.png"
        file.seek(0)
        yield file
        file.close()

    request.cls.get_image_file = function


@pytest.fixture(scope="class")
def get_image_path(request):
    def function(request, user_id: int, storage_path: str):
        # Change the current working directory to the specified directory
        os.chdir(settings.BASE_DIR / f"media/solution/user_{user_id}/{storage_path}")
        image_name = os.listdir()[0]
        return f"http://testserver/media/solution/user_{user_id}/{storage_path}/{image_name}"

    request.cls.get_image_path = function


@pytest.fixture(scope="class")
def format_datetime(request):
    def function(request, datetime_obj: str | datetime.datetime):
        formats = [
            "%Y-%m-%dT%H:%M:%S.%f%z",
            "%Y-%m-%dT%H:%M:%S.%f",
            "%Y-%m-%dT%H:%M:%S%z",
            "%Y-%m-%dT%H:%M:%S",
        ]

        if isinstance(datetime_obj, datetime.datetime):
            datetime_obj = datetime_obj.strftime("%Y-%m-%dT%H:%M:%S.%f%z")

        parsed_datetime = None
        # Parse the input string into a datetime object
        for format_code in formats:
            try:
                parsed_datetime = datetime.datetime.strptime(datetime_obj, format_code)
            except ValueError:
                pass

        if parsed_datetime is None:
            return datetime_obj

        if parsed_datetime.tzinfo is None:
            # If the timezone is not specified, assume UTC
            parsed_datetime = parsed_datetime.replace(tzinfo=datetime.UTC)

        # Format the datetime as a string
        formatted_datetime = parsed_datetime.strftime("%Y-%m-%dT%H:%M")

        return formatted_datetime

    request.cls.format_datetime = function


@pytest.fixture(scope="class")
def api_user(request):
    user = User.objects.create_user("jack", "jack@email.com", "123")
    auth_client = APIClient()
    auth_client.force_authenticate(user=user)
    request.cls.user = user
    request.cls.auth_client = auth_client
