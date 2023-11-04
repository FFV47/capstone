from uuid import uuid4

from django import forms
from django.core.exceptions import ValidationError
from django.utils.translation import (
    gettext_lazy as _,
)

from solution.models import User

from .validators import UsernameEmailValidator


class UsernameEmailField(forms.CharField):
    def validate(self, value: str) -> None:
        """Validate username or email input"""
        super().validate(value)
        validate_username_email = UsernameEmailValidator()
        validate_username_email(value)


class LoginForm(forms.Form):
    email_username = UsernameEmailField()
    password = forms.CharField(min_length=3)


class RegisterForm(forms.Form):
    email = forms.EmailField()
    username = forms.CharField()
    password = forms.CharField(min_length=3)
    confirmation = forms.CharField(min_length=3)

    def clean_email(self):
        email: str = self.cleaned_data["email"]
        if User.objects.filter(email=email).exists():
            raise ValidationError(
                _("A user with this email already exists"),
                code="email_exists",
            )

        return email

    def clean_username(self):
        username: str = self.cleaned_data["username"]
        if User.objects.filter(username=username).exists():
            return f"{username}_{uuid4()}"

        return username

    def clean(self):
        cleaned_data = super().clean()

        password: str = cleaned_data["password"]
        confirmation: str = cleaned_data["confirmation"]

        if password != confirmation:
            error = ValidationError(
                _("Passwords must match."),
                code="password_mismatch",
            )

            self.add_error("password", error)
            self.add_error("confirmation", error)

        return cleaned_data
