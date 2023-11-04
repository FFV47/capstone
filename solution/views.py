from django.contrib.auth import authenticate, login, logout
from django.core.exceptions import ValidationError
from django.http import HttpRequest
from django.shortcuts import redirect, render
from django.views.generic import TemplateView

# from django.contrib.auth.decorators import login_required
# from django.utils.decorators import method_decorator
from solution.forms import LoginForm, RegisterForm
from solution.models import User


class AuthHttpRequest(HttpRequest):
    user: User


class IndexView(TemplateView):
    template_name: str = "solution/index.html"

    def get(self, request: AuthHttpRequest):
        if request.user.is_authenticated:
            user_data = {
                "firstName": request.user.first_name,
                "lastName": request.user.last_name,
                "username": request.user.username,
                "authenticated": request.user.is_authenticated,
                # "hasAccount": request.user.has_account,
            }
        else:
            user_data = {
                "firstName": None,
                "lastName": None,
                "username": request.user.username,
                "authenticated": request.user.is_authenticated,
                "hasAccount": False,
            }
        context = {"user_data": user_data}

        return render(request, self.template_name, context)


class RegisterView(TemplateView):
    template_name = "solution/register.html"

    def post(self, request: HttpRequest):
        form = RegisterForm(request.POST)

        if form.is_valid():
            email: str = form.cleaned_data["email"]
            password: str = form.cleaned_data["password"]
            username: str = form.cleaned_data["username"]

            try:
                user: User = User.objects.create_user(
                    username=username, email=email, password=password
                )
                user.user_permissions.clear()

                login(request=request, user=user)
                return redirect("solution:index")

            except ValidationError:
                return render(
                    request,
                    self.template_name,
                    {"form_errors": form.errors, "fields": form.cleaned_data},
                )
        else:
            return render(
                request,
                self.template_name,
                {"form_errors": form.errors, "fields": form.cleaned_data},
            )


class LoginView(TemplateView):
    template_name: str = "solution/login.html"

    def post(self, request: HttpRequest):
        form = LoginForm(request.POST)

        if form.is_valid():
            email = request.POST.get("email_username")
            username = email.split("@")[0]
            password = request.POST.get("password")

            user = authenticate(request=request, username=username, password=password)

            if user is not None:
                login(request=request, user=user)
                return redirect("solution:index")

            return render(request, self.template_name, {"auth_error": "Invalid Credentials"})

        return render(
            request, self.template_name, {"form_errors": form.errors, "fields": form.cleaned_data}
        )


def logout_view(request: HttpRequest):
    logout(request)
    return redirect("solution:index")
