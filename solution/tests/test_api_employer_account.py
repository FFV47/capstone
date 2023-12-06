from datetime import datetime
from typing import Callable

import pytest
from rest_framework.test import APIClient, APITestCase

from solution.models import User


@pytest.mark.usefixtures("get_image_file", "get_image_path", "api_user", "format_datetime")
class EmployerAccountTestCase(APITestCase):
    # Defined in conftest.py
    user: User
    auth_client: APIClient
    get_image_file: Callable
    get_image_path: Callable[[int, str], str]
    format_datetime: Callable

    def setUp(self):
        self.employer_account = {
            "logo": None,
            "companyName": "Brave",
            "address": "128379",
            "legalName": "Brave",
            "industry": "Arts",
            "companySize": "micro",
            "location": "New York",
            "companyUrl": "https://brave.com",
            "description": "Some description",
            "personalPhoto": None,
            "role": "Consultant",
            "firstName": "John",
            "lastName": "Doe",
            "phone": "12345918723897",
            "verifiedId": False,
            "lastUpdate": self.format_datetime(datetime.now()),
        }

    def create_account(self, has_photo: bool):
        data = {
            "companyName": "Brave",
            "address": "128379",
            "legalName": "Brave",
            "industry": "Arts",
            "companySize": "micro",
            "location": "New York",
            "companyUrl": "https://brave.com",
            "description": "Some description",
            "role": "Consultant",
            "firstName": "John",
            "lastName": "Doe",
            "phone": "12345918723897",
        }

        if has_photo:
            data["logo"] = self.get_image_file()
            data["personalPhoto"] = self.get_image_file()

        return self.auth_client.post("/solution-api/employer-account", data)

    def test_create_account(self):
        response = self.create_account(has_photo=False)
        assert response.status_code == 201

        response.data["lastUpdate"] = self.format_datetime(response.data["lastUpdate"])

        assert response.data == self.employer_account

    def test_create_account_with_photo(self):
        response = self.create_account(has_photo=True)
        assert response.status_code == 201

        response.data["lastUpdate"] = self.format_datetime(response.data["lastUpdate"])

        self.employer_account["logo"] = self.get_image_path(self.user.id, "employer/logo")
        self.employer_account["personalPhoto"] = self.get_image_path(self.user.id, "employer/photo")

        assert response.data == self.employer_account

    def test_update_account(self):
        create_response = self.create_account(has_photo=False)
        response = self.auth_client.put(
            "/solution-api/employer-account", {"companyName": "JetBrains"}
        )

        assert response.status_code == 400

        data = {
            **create_response.data,
            "companyName": "JetBrains",
        }

        for k, v in list(data.items()):
            if k is "lastUpdate" or v is None:
                data.pop(k)

        response = self.auth_client.put("/solution-api/employer-account", data)

        assert response.status_code == 200

        response.data["lastUpdate"] = self.format_datetime(response.data["lastUpdate"])
        self.employer_account["companyName"] = "JetBrains"

        assert response.data == self.employer_account

    def test_patch_account(self):
        self.create_account(has_photo=False)
        response = self.auth_client.patch(
            "/solution-api/employer-account", {"companyName": "JetBrains"}
        )

        assert response.status_code == 200

        response.data["lastUpdate"] = self.format_datetime(response.data["lastUpdate"])
        self.employer_account["companyName"] = "JetBrains"
        assert response.data == self.employer_account

    def test_delete_account(self):
        self.create_account(has_photo=False)
        response = self.auth_client.delete("/solution-api/employer-account")
        assert response.status_code == 204
