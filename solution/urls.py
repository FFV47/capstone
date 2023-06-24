from django.urls import include, path, re_path
from rest_framework.urlpatterns import format_suffix_patterns

from solution import api_views, views

app_name = "solution"

urlpatterns = [
    path("", views.IndexView.as_view(), name="index"),
    path("register", views.RegisterView.as_view(), name="register"),
    path("login", views.LoginView.as_view(), name="login"),
    path("logout", views.logout_view, name="logout"),
    path("solution-api", api_views.api_root, name="api-root"),
    path("solution-api/roles", api_views.roles, name="roles"),
    path("solution-api/job-data", api_views.job_data, name="job-data"),
    path("api-auth/", include("rest_framework.urls"), name="rest_framework"),
    # Match every url, except if starts with "media" or "static"
    re_path(
        r"^(?!admin|media|static|__reload__|__debug__)",
        views.IndexView.as_view(),
        name="react_root",
    ),
]

urlpatterns = format_suffix_patterns(urlpatterns)
