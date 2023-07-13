import re
from pprint import pprint
from typing import Any, OrderedDict, TypedDict, get_type_hints

from django.http import QueryDict
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from solution.models import BusinessAccount, PersonalAccount, Profession


def camel_to_snake(s: str):
    return "".join(["_" + c.lower() if c.isupper() else c for c in s]).lstrip("_")


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


class PersonalAccountSerializer(CamelCaseSerializer, serializers.ModelSerializer):
    class Meta:
        model = PersonalAccount
        exclude = ["user"]

    profession = serializers.SlugRelatedField(
        slug_field="name", queryset=Profession.objects.all()
    )


class BusinessAccountSerializer(CamelCaseSerializer, serializers.ModelSerializer):
    class Meta:
        model = BusinessAccount
        exclude = ["user"]

    def to_representation(self, instance: Any) -> Any:
        response = super().to_representation(instance)
        response["companySize"] = BusinessAccount.CompanySize.labels[
            instance.company_size
        ]
        return response

    def to_internal_value(self, data: QueryDict) -> Any:
        """
        When the request is sent as FormData, request.data will be a QueryDict
        which is immutable. Each key can have multiple values.
        https://docs.djangoproject.com/en/4.2/ref/request-response/#querydict-objects
        """
        mutable_data = data.copy()
        company_size = mutable_data["companySize"]
        if company_size.upper() not in BusinessAccount.CompanySize.names:
            raise serializers.ValidationError(_("Invalid company size"))

        mutable_data["companySize"] = BusinessAccount.CompanySize[company_size.upper()]  # type: ignore
        pprint(mutable_data, indent=4, sort_dicts=False)
        return super().to_internal_value(mutable_data)  # type: ignore
