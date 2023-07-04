from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from solution.models import BusinessAccount, PersonalAccount, Profession


class PersonalAccountSerializer(serializers.ModelSerializer):
    profession = serializers.SlugRelatedField(
        slug_field="name", queryset=Profession.objects.all()
    )

    class Meta:
        model = PersonalAccount
        exclude = ["user"]


class BusinessAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessAccount
        exclude = ["user"]
