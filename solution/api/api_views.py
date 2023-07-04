from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.reverse import reverse
from rest_framework.views import APIView

from solution.api.serializers import BusinessAccountSerializer, PersonalAccountSerializer
from solution.models import (
    BusinessAccount,
    DaysSchedule,
    JobTag,
    JobType,
    PersonalAccount,
    Profession,
    Shift,
    User,
)


class AuthRequest(Request):
    user: User


@api_view(["GET"])
def api_root(request):
    return Response(
        {
            "roles": reverse("solution:roles", request=request),
            "job-data": reverse("solution:job-data", request=request),
            "personal-account": reverse("solution:personal-account", request=request),
            "business-account": reverse("solution:business-account", request=request),
        }
    )


@api_view(["GET"])
def roles(request):
    roles = Profession.objects.all()
    return Response([x.name for x in roles])


@api_view(["GET"])
def job_data(request):
    job_types = JobType.objects.all()
    shifts = Shift.objects.all()
    days_schedule = DaysSchedule.objects.all()
    tags = JobTag.objects.all()

    # sleep(100)
    # return Response("hello")
    return Response(
        {
            "job_types": [x.name for x in job_types],
            "shifts": [x.name for x in shifts],
            "days_schedule": [x.name for x in days_schedule],
            "tags": [x.name for x in tags],
        }
    )


class PersonalAccountView(APIView):
    """
    A simple view to create and edit personal accounts
    Required fields:
        role
        name
        location
    """

    def get_object(self, user) -> PersonalAccount:
        return get_object_or_404(PersonalAccount, user=user)

    def update(self, request: AuthRequest, partial: bool = False) -> Response:
        User.objects.get(id=request.user.id)

        account = self.get_object(request.user)
        request.data
        serializer = PersonalAccountSerializer(
            account,
            data=request.data,
            partial=partial,
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request: Request) -> Response:
        qs = PersonalAccount.objects.all()
        serializer = PersonalAccountSerializer(qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request: AuthRequest) -> Response:
        serializer = PersonalAccountSerializer(data=request.data)

        if serializer.is_valid():
            try:
                serializer.save(user=request.user)
                request.user.has_account = True
                request.user.save()
            except ValidationError as e:
                error_dict = {k: (", ").join(v) for k, v in e.message_dict.items()}
                return Response(error_dict, status=status.HTTP_400_BAD_REQUEST)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request: AuthRequest) -> Response:
        return self.update(request)

    def patch(self, request: AuthRequest) -> Response:
        return self.update(request, partial=True)

    def delete(self, request: Request) -> Response:
        account = self.get_object(request.user)
        account.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class BusinessAccountView(APIView):
    """
    A simple view to create and edit business accounts
    Required fields:
        role
        name
        location
    """

    def get_object(self, user) -> BusinessAccount:
        return get_object_or_404(BusinessAccount, user=user)

    def update(self, request: Request, partial: bool = False) -> Response:
        account = self.get_object(request.user)
        serializer = BusinessAccountSerializer(
            account,
            data=request.data,
            partial=partial,
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request: Request) -> Response:
        qs = BusinessAccount.objects.all()
        serializer = BusinessAccountSerializer(qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request: Request) -> Response:
        serializer = BusinessAccountSerializer(data=request.data)

        if serializer.is_valid():
            try:
                serializer.save(user=request.user)
            except ValidationError as e:
                error_dict = {k: (", ").join(v) for k, v in e.message_dict.items()}
                return Response(error_dict, status=status.HTTP_400_BAD_REQUEST)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request: Request) -> Response:
        return self.update(request)

    def patch(self, request: Request) -> Response:
        return self.update(request, partial=True)

    def delete(self, request: Request) -> Response:
        account = self.get_object(request.user)
        account.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
