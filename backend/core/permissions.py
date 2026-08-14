from rest_framework.permissions import BasePermission

from accounts.models import Staff


class IsAdminOrSuperUser(BasePermission):

    message = "شما دسترسی لازم برای انجام این عملیات را ندارید."

    def has_permission(self, request, view):

        user = request.user

        if not user.is_authenticated:
            return False

        return (
            user.is_superuser
            or user.user_roles.filter(
                role__name="admin"
            ).exists()
        )


class IsStaff(BasePermission):
    message = "شما دسترسی لازم برای انجام این عملیات را ندارید."

    def has_permission(self, request, view):
        user = request.user

        if not user.is_authenticated:
            return False

        return Staff.objects.filter(user=user).exists()