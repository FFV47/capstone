from rest_framework.test import APIClient, APITestCase

from solution.models import User


class TestChangePassword(APITestCase):
    user = None
    api_client = None

    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user("jack", "jack@email.com", "123")
        cls.api_client = APIClient()
        cls.api_client.force_authenticate(user=cls.user)

    def test_wrong_password(self):
        response = self.api_client.patch(
            "/solution-api/change-password",
            {
                "oldPassword": "1234",
                "newPassword": "MyP@ssw0rd",
                "newPasswordConfirmation": "MyP@ssw0rd2",
            },
        )

        assert response.status_code == 400
        assert response.data["errors"]["detail"] == "Wrong current password."

    def test_password_mismatch(self):
        response = self.api_client.patch(
            "/solution-api/change-password",
            {
                "oldPassword": "123",
                "newPassword": "MyP@ssw0rd",
                "newPasswordConfirmation": "MyP@ssw0rd2",
            },
        )

        assert response.status_code == 400
        assert response.data["errors"]["detail"] == "Passwords don't match."

    def test_password_regex(self):
        response = self.api_client.patch(
            "/solution-api/change-password",
            {
                "oldPassword": "123",
                "newPassword": "password",
                "newPasswordConfirmation": "password",
            },
        )

        assert response.status_code == 400
        assert response.data["newPassword"]["detail"] == "Password is not valid."
        assert response.data["newPasswordConfirmation"]["detail"] == "Password is not valid."
