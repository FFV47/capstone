from django.db import models
from django.http import Http404
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.serializers import Serializer

from solution import models as app_models
from solution.api import serializers as app_serializers
from solution.api.permissions import IsOwnerOrStaff


class AuthRequest(Request):
    user: app_models.User


@extend_schema(responses=OpenApiResponse())
@api_view(["GET"])
def api_root(request):
    return Response(
        {
            "roles": reverse("solution:api:roles", request=request),
            "job-data": reverse("solution:api:job-data", request=request),
            "worker-account": reverse("solution:api:worker-account", request=request),
            "employer-account": reverse("solution:api:employer-account", request=request),
        }
    )


@extend_schema(responses=OpenApiResponse({"type": "array", "items": {"type": "string"}}))
@api_view(["GET"])
def roles(request):
    roles = app_models.Profession.objects.all()
    return Response([x.name for x in roles])


@extend_schema(responses=OpenApiResponse())
@api_view(["GET"])
def job_data(request):
    job_types = app_models.JobType.objects.all()
    shifts = app_models.Shift.objects.all()
    days_schedule = app_models.DaysSchedule.objects.all()
    tags = app_models.JobTag.objects.all()

    return Response(
        {
            "job_types": [x.name for x in job_types],
            "shifts": [x.name for x in shifts],
            "days_schedule": [x.name for x in days_schedule],
            "tags": [x.name for x in tags],
        }
    )


class AccountView(generics.GenericAPIView):
    model = models.Model
    serializer_class: Serializer
    permission_classes = [permissions.IsAuthenticated & IsOwnerOrStaff]
    request: AuthRequest

    def __get_object_or_404(self, Model: models.Model, *args, **kwargs):
        try:
            return Model.objects.get(*args, **kwargs)
        except Model.DoesNotExist:
            raise Http404(f"No {Model.__name__} matches the given query.")

    def get_object(self, username=None):
        if username is not None:
            obj = self.__get_object_or_404(self.model, user__username=username)
            self.check_object_permissions(self.request, obj)
            return obj
        else:
            return get_object_or_404(self.model, user=self.request.user)

    def get_queryset(self) -> models.QuerySet:
        """
        Only allows users to see their own objects. Except for Staff
        """
        if self.request.user.is_staff:
            return super().get_queryset()
        else:
            return self.model.objects.filter(user=self.request.user)

    def update(self, request: AuthRequest, partial=False):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)

    def get(self, request, username=None) -> Response:
        if username:
            return Response(
                self.get_serializer(self.get_object(username)).data,
                status=status.HTTP_200_OK,
            )
        else:
            return Response(
                self.get_serializer(self.get_queryset(), many=True).data,
                status=status.HTTP_200_OK,
            )

    def post(self, request: AuthRequest):
        serializer = self.get_serializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()

        if self.model == app_models.WorkerAccount:
            request.user.has_worker_account = True
        else:
            request.user.has_employer_account = True
        request.user.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def put(self, request: AuthRequest):
        return self.update(request, partial=False)

    def patch(self, request: AuthRequest):
        return self.update(request, partial=True)

    def delete(self, request: AuthRequest, username=None):
        if username == "_all" and request.user.is_staff:
            self.get_queryset().delete()
            all_users = app_models.User.objects.all()
            for user in all_users:
                user.has_worker_account = False
                user.has_employer_account = False
                user.save()

            app_models.User.objects.bulk_update(
                all_users, ["has_worker_account", "has_employer_account"]
            )
            return Response(status=status.HTTP_204_NO_CONTENT)

        self.get_object(username).delete()

        if self.model == app_models.WorkerAccount:
            request.user.has_worker_account = False
        else:
            request.user.has_employer_account = False

        request.user.save()

        return Response(status=status.HTTP_204_NO_CONTENT)


class WorkerAccountView(AccountView):
    """
    A simple view to create and edit personal accounts
    """

    model = app_models.WorkerAccount
    serializer_class = app_serializers.WorkerAccountSerializer

    def get_queryset(self) -> models.QuerySet:
        return self.model.objects.select_related("user", "profession")


class EmployerAccountView(AccountView):
    """
    A simple view to create and edit business accounts
    """

    model = app_models.EmployerAccount
    serializer_class = app_serializers.EmployerAccountSerializer

    def get_queryset(self) -> models.QuerySet:
        return self.model.objects.select_related("user")


class ChangePasswordView(generics.GenericAPIView):
    serializer_class = app_serializers.ChangePasswordSerializer

    def patch(self, request: AuthRequest) -> Response:
        serializer = self.get_serializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        request.user.set_password(serializer.validated_data["new_password"])
        request.user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
