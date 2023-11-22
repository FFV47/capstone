from django.urls import path
from drf_spectacular.views import SpectacularSwaggerView, SpectacularAPIView

from solution.api import api_views

app_name = "api"

urlpatterns = [
    path("", api_views.api_root, name="api-root"),
    path("roles", api_views.roles, name="roles"),
    path("job-data", api_views.job_data, name="job-data"),
    path("worker-account", api_views.WorkerAccountView.as_view(), name="worker-account"),
    path(
        "worker-account/<str:username>",
        api_views.WorkerAccountView.as_view(),
        name="worker-account",
    ),
    path("employer-account", api_views.EmployerAccountView.as_view(), name="employer-account"),
    path(
        "employer-account/<str:username>",
        api_views.EmployerAccountView.as_view(),
        name="employer-account",
    ),
    path("change-password", api_views.ChangePasswordView.as_view(), name="change-password"),
    path("schema", SpectacularAPIView.as_view(), name="schema"),
    path("docs", SpectacularSwaggerView.as_view(url_name="solution:api:schema"), name="swagger-ui"),
]
