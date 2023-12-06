from typing import Any, OrderedDict

from django.contrib.auth.hashers import check_password
from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from solution import models as app_models


def camel_to_snake(s: str):
    return "".join(["_" + c.lower() if c.isupper() else c for c in s.replace("_", "")]).lstrip("_")


def snake_to_camel(s: str):
    return s[0] + s.title().replace("_", "")[1:]


class CamelCaseSerializer(serializers.BaseSerializer):
    def to_representation(self, instance: Any) -> Any:
        resp_dict: OrderedDict[str, Any] = super().to_representation(instance)
        return {snake_to_camel(k): v for k, v in resp_dict.items()}

    def to_internal_value(self, data: dict[str, Any]) -> Any:
        req_dict = {camel_to_snake(k): v for k, v in data.items()}
        # logger = logging.getLogger("solution.request")
        # logger.debug(pprint.pformat(req_dict, indent=2, sort_dicts=False))

        return super().to_internal_value(req_dict)


class CustomModelSerializer(CamelCaseSerializer, serializers.ModelSerializer):
    pass


class CustomSerializer(CamelCaseSerializer, serializers.Serializer):
    pass


class WorkerAccountSerializer(CustomModelSerializer):
    class Meta:
        model = app_models.WorkerAccount
        fields = [
            "user",
            "photo",
            "profession",
            "first_name",
            "last_name",
            "birthdate",
            "phone",
            "rating",
            "location",
            "about",
            "verified_id",
            "driving_license",
            "review_count",
            "jobs_done",
            "last_update",
        ]

    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    profession = serializers.SlugRelatedField(
        slug_field="name", queryset=app_models.Profession.objects.all()
    )


class EmployerAccountSerializer(CustomModelSerializer):
    class Meta:
        model = app_models.EmployerAccount
        fields = [
            "user",
            "logo",
            "company_name",
            "address",
            "legal_name",
            "industry",
            "company_size",
            "location",
            "company_url",
            "description",
            "personal_photo",
            "role",
            "first_name",
            "last_name",
            "phone",
            "verified_id",
            "last_update",
        ]

    user = serializers.HiddenField(default=serializers.CurrentUserDefault())


class ChangePasswordSerializer(CustomSerializer):
    """
    This regular expression breaks down as follows:
    ^: Start of the string.
    (?=.*[A-Z]): Lookahead assertion to ensure at least one uppercase letter.
    (?=.*\d): Lookahead assertion to ensure at least one digit (number).
    (?=.*[@#$%^&+=!]): Lookahead assertion to ensure at least one special character.
    You can add more special characters inside the square brackets if needed.
    .{8,20}: Match any character (except for a newline) between 8 and 20 times.
    $: End of the string.
    """

    passwd_validator = RegexValidator(
        r"^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,20}$", "Password is not valid."
    )

    user = serializers.HiddenField(default=serializers.CurrentUserDefault())
    old_password = serializers.CharField(max_length=20)
    new_password = serializers.CharField(validators=[passwd_validator])
    new_password_confirmation = serializers.CharField(validators=[passwd_validator])

    def validate(self, data) -> Any:
        if not check_password(data["old_password"], data["user"].password):
            raise serializers.ValidationError(_("Wrong current password."))

        if data["new_password"] != data["new_password_confirmation"]:
            raise serializers.ValidationError(_("Passwords don't match."))

        return data
