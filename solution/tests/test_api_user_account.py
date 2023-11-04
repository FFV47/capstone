import datetime
import io
import os

import pytest
from django.conf import settings
from PIL import Image
from rest_framework.test import APIClient, APITestCase

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


class ChangePasswordTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls) -> None:
        cls.user = User.objects.create_user("john", "john@email.com", "123")
        cls.api_client = APIClient()
        cls.api_client.force_authenticate(user=cls.user)

    def test_change_password(self):
        response = self.api_client.patch(
            "/solution-api/change-password",
            {
                "old_password": "123",
                "new_password": "MyP@ssw0rd",
                "new_password_confirmation": "MyP@ssw0rd",
            },
        )

        assert response.status_code == 204

    def test_wrong_password(self):
        response = self.api_client.patch(
            "/solution-api/change-password",
            {
                "old_password": "1234",
                "new_password": "MyP@ssw0rd",
                "new_password_confirmation": "MyP@ssw0rd2",
            },
        )

        assert response.status_code == 400
        assert response.data["errors"] == ["Wrong current password."]

    def test_password_mismatch(self):
        response = self.api_client.patch(
            "/solution-api/change-password",
            {
                "old_password": "123",
                "new_password": "MyP@ssw0rd",
                "new_password_confirmation": "MyP@ssw0rd2",
            },
        )

        assert response.status_code == 400
        assert response.data["errors"] == ["Passwords don't match."]

    def test_password_regex(self):
        response = self.api_client.patch(
            "/solution-api/change-password",
            {
                "old_password": "123",
                "new_password": "password",
                "new_password_confirmation": "password",
            },
        )

        assert response.status_code == 400
        assert response.data["new_password"] == ["Password is not valid."]
        assert response.data["new_password_confirmation"] == ["Password is not valid."]


class PersonalAccountTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls) -> None:
        cls.user = User.objects.create_user("john", "john@email.com", "123")
        cls.api_client = APIClient()
        cls.api_client.force_authenticate(user=cls.user)

    def generate_photo_file(self):
        file = io.BytesIO()
        image = Image.new("RGBA", size=(100, 100), color=(155, 0, 0))
        image.save(file, "png")
        file.name = "test.png"
        file.seek(0)
        return file

    def create_account(self):
        return self.api_client.post(
            "/solution-api/personal-account",
            {
                "profession": "Painter",
                "firstName": "John",
                "lastName": "Doe",
                "birthdate": "1990-11-08",
                "phone": 10283017238917,
                "location": "New York",
                "photo": self.generate_photo_file(),
            },
        )

    def test_create_account(self):
        response = self.create_account()
        assert response.status_code == 201

        # Change the current working directory to the specified directory
        os.chdir(settings.BASE_DIR / f"media/solution/user_{self.user.id}/personal")
        # List the contents of the directory
        directory_contents = os.listdir()
        # Print the contents of the directory
        photo_name = directory_contents[0]

        personal_account = {
            "profession": "Painter",
            "firstName": "John",
            "lastName": "Doe",
            "birthdate": "1990-11-08",
            "phone": "10283017238917",
            "location": "New York",
            "about": "",
            "drivingLicense": False,
            "jobsDone": 0,
            "lastUpdate": datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
            "photo": f"/media/solution/user_{self.user.id}/personal/{photo_name}",
            "rating": 0,
            "reviewCount": 0,
            "verifiedId": False,
        }

        response.data["lastUpdate"] = response.data["lastUpdate"][0:19]

        assert response.data == personal_account

    def test_update_account(self):
        self.create_account()
        response = self.api_client.put(
            "/solution-api/personal-account",
            {
                "profession": "Carpenter",
                # "firstName": "John",
                # "lastName": "Doe",
                # "birthdate": "1990-11-08",
                # "phone": 10283017238917,
                # "location": "New York",
                # "photo": self.generate_photo_file(),
            },
        )

        assert response.status_code == 400

        personal_account = {
            "profession": "Carpenter",
            "firstName": "John",
            "lastName": "Doe",
            "birthdate": "1990-11-08",
            "phone": "10283017238917",
            "location": "New York",
            "about": "",
            "drivingLicense": False,
            "jobsDone": 0,
            "lastUpdate": datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S"),
            "rating": 0,
            "reviewCount": 0,
            "verifiedId": False,
        }

        # response.data["lastUpdate"] = response.data["lastUpdate"][0:19]

        assert response.data == personal_account
