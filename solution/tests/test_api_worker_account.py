from datetime import datetime
from typing import Callable

import pytest
from rest_framework.test import APIClient, APITestCase

from solution.models import User


@pytest.mark.usefixtures("get_image_file", "get_image_path", "api_user", "format_datetime")
class WorkerAccountTestCase(APITestCase):
    # Defined in conftest.py
    user: User
    auth_client: APIClient
    get_image_file: Callable
    get_image_path: Callable[[int, str], str]
    format_datetime: Callable

    def setUp(self):
        self.worker_account = {
            "photo": None,
            "profession": "Painter",
            "firstName": "John",
            "lastName": "Doe",
            "birthdate": "1990-11-08",
            "phone": "10283017238917",
            "rating": 0,
            "location": "New York",
            "about": "",
            "verifiedId": False,
            "drivingLicense": False,
            "jobsDone": 0,
            "reviewCount": 0,
            "lastUpdate": self.format_datetime(datetime.now()),
        }

    def create_account(self, has_photo: bool):
        data = {
            "profession": "Painter",
            "firstName": "John",
            "lastName": "Doe",
            "birthdate": "1990-11-08",
            "phone": 10283017238917,
            "location": "New York",
        }

        if has_photo:
            data["photo"] = self.get_image_file()

        return self.auth_client.post("/solution-api/worker-account", data)

    def test_create_account(self):
        response = self.create_account(has_photo=False)
        assert response.status_code == 201

        response.data["lastUpdate"] = self.format_datetime(response.data["lastUpdate"])

        assert response.data == self.worker_account

    def test_create_account_with_photo(self):
        response = self.create_account(has_photo=True)
        assert response.status_code == 201

        # Change the current working directory to the specified directory

        self.worker_account["photo"] = self.get_image_path(self.user.id, "worker")

        response.data["lastUpdate"] = self.format_datetime(response.data["lastUpdate"])

        assert response.data == self.worker_account

    def test_update_account(self):
        self.create_account(has_photo=False)
        response = self.auth_client.put("/solution-api/worker-account", {"profession": "Carpenter"})

        assert response.status_code == 400

        response = self.auth_client.put(
            "/solution-api/worker-account",
            {
                "profession": "Carpenter",
                "firstName": "John",
                "lastName": "Doe",
                "birthdate": "1990-11-08",
                "phone": 10283017238917,
                "location": "New York",
            },
        )

        assert response.status_code == 200

        response.data["lastUpdate"] = self.format_datetime(response.data["lastUpdate"])
        self.worker_account["profession"] = "Carpenter"

        assert response.data == self.worker_account

    def test_patch_account(self):
        self.create_account(False)
        response = self.auth_client.patch(
            "/solution-api/worker-account", {"profession": "Carpenter"}
        )

        assert response.status_code == 200

        response.data["lastUpdate"] = self.format_datetime(response.data["lastUpdate"])
        self.worker_account["profession"] = "Carpenter"

        assert response.data == self.worker_account

    def test_delete_account(self):
        self.create_account(False)
        response = self.auth_client.delete("/solution-api/worker-account")

        assert response.status_code == 204
