from typing import Any

import orjson
from django.http import HttpRequest
from ninja.renderers import BaseRenderer
from ninja.security import HttpBearer
from ninja_extra import NinjaExtraAPI
from ninja_jwt.controller import NinjaJWTDefaultController
from oauth2_provider.models import AccessToken

from solution.models import Role


class AuthBearer(HttpBearer):
    def authenticate(self, request: HttpRequest, token: str) -> Any | None:
        access_token = AccessToken.objects.get(user=request.user, token=token)
        if access_token:
            return access_token


class ORJSONRenderer(BaseRenderer):
    media_type = "application/json"

    def render(self, request: HttpRequest, data: Any, *, response_status: int) -> Any:
        return orjson.dumps(data)


api = NinjaExtraAPI(
    # docs_decorator=staff_member_required,
    urls_namespace="solution-api",
    renderer=ORJSONRenderer(),
)

api.register_controllers(NinjaJWTDefaultController)


@api.get("/roles")
def roles(request):
    return [role.name for role in Role.objects.all()]
