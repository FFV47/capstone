from django.urls import path, re_path
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

from solution.api import api_views

app_name = "api"

urlpatterns = [
    path("", api_views.api_root, name="api-root"),
    path("roles", api_views.roles, name="roles"),
    path("job-data", api_views.job_data, name="job-data"),
    re_path(
        r"^personal-account/?(?P<username>\w*)$",
        api_views.PersonalAccountView.as_view(),
        name="personal-account",
    ),
    re_path(
        r"business-account/?(?P<username>\w*)$",
        api_views.BusinessAccountView.as_view(),
        name="business-account",
    ),
    path("change-password", api_views.ChangePasswordView.as_view(), name="change-password"),
    path("schema", SpectacularAPIView.as_view(), name="schema"),
    path("redoc", SpectacularRedocView.as_view(url_name="solution:api:schema"), name="redoc"),
    path(
        "swagger", SpectacularSwaggerView.as_view(url_name="solution:api:schema"), name="swagger-ui"
    ),
]
