from django.urls import path, re_path

from solution import views

app_name = "solution"

urlpatterns = [
    path("", views.IndexView.as_view(), name="index"),
    path("register", views.RegisterView.as_view(), name="register"),
    path("login", views.LoginView.as_view(), name="login"),
    path("logout", views.logout_view, name="logout"),
    # Match every url, except if starts with "media" or "static"
    re_path(
        r"^(?!media|static|__reload__|__debug__)",
        views.IndexView.as_view(),
        name="react_root",
    ),
]
