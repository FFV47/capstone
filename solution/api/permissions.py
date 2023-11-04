from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from solution.models import User


class AuthRequest(Request):
    user: User


class IsOwnerOrStaff(BasePermission):
    """
    Object-level permission to only allow owners of an object to delete it.
    Except for staff
    """

    message = "Only the owner of the object can delete it."

    def has_object_permission(self, request: AuthRequest, view, obj):
        if request.user.is_staff:
            return True

        return obj.user == request.user
