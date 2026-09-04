from django.core.cache import cache
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.generics import GenericAPIView, RetrieveAPIView
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

from accounts.Api.v1.serializer import *
from accounts.models import Role, Staff, User
from core.permissions import IsAdminOrSuperUser


def get_tokens_for_user(user):

    refresh = RefreshToken.for_user(user)

    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }


class LoginView(APIView):
    def post(self, request):

        serializer = PasswordLoginSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data["user"]

        tokens = get_tokens_for_user(user)

        response = Response({"access": tokens["access"]})

        response.set_cookie(
            key="refresh_token",
            value=tokens["refresh"],
            httponly=True,
            secure=False,  # True در production
            samesite="Lax",
            max_age=7 * 24 * 60 * 60,
        )

        return response


class RefreshTokenView(APIView):
    def post(self, request):

        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            raise AuthenticationFailed("Refresh token وجود ندارد")

        try:
            refresh = RefreshToken(refresh_token)

            access = str(refresh.access_token)

            return Response({"access": access})

        except Exception:
            raise AuthenticationFailed("Refresh token نامعتبر است")


class VerifyTokenView(APIView):
    authentication_classes = [JWTAuthentication]

    permission_classes = [IsAuthenticated]

    def get(self, request):

        return Response(
            {
                "valid": True,
                "user": {
                    "id": request.user.id,
                    "username": request.user.username,
                },
            }
        )


class LogoutView(APIView):
    def post(self, request):

        response = Response({"message": "Logged out"})

        response.delete_cookie("refresh_token")

        return response


class RoleListAPIView(GenericAPIView):
    queryset = Role.objects.all()

    serializer_class = RoleSerializer

    permission_classes = (IsAdminOrSuperUser,)

    filter_backends = (
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    )

    search_fields = (
        "name",
        "description",
    )

    ordering_fields = (
        "id",
        "name",
    )

    ordering = ("-id",)

    def get(self, request):

        cache_key = f"roles:{request.get_full_path()}"

        cached = cache.get(cache_key)

        if cached:
            return Response(cached)

        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)

        serializer = self.get_serializer(
            page,
            many=True,
        )

        response = self.get_paginated_response(serializer.data)

        cache.set(
            cache_key,
            response.data,
            timeout=300,
        )

        return response


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_user_role(request):
    return Response({
        "is_staff": request.user.is_staff,
        "roles": list(
            request.user.roles.values_list("name", flat=True)
        ),
    })


class RoleDetailAPIView(GenericAPIView):
    serializer_class = RoleSerializer

    permission_classes = (IsAdminOrSuperUser,)

    def get(self, request, pk):

        cache_key = f"role:{pk}"

        cached = cache.get(cache_key)

        if cached:
            return Response(cached)

        role = get_object_or_404(
            Role,
            pk=pk,
        )

        serializer = self.get_serializer(role)

        cache.set(
            cache_key,
            serializer.data,
            timeout=300,
        )

        return Response(serializer.data)


class RoleCreateAPIView(GenericAPIView):
    serializer_class = RoleCreateSerializer

    permission_classes = (IsAdminOrSuperUser,)

    def post(self, request):

        serializer = self.get_serializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        role = serializer.save()

        cache.clear()

        return Response(
            RoleSerializer(role).data,
            status=status.HTTP_201_CREATED,
        )


class RoleUpdateAPIView(GenericAPIView):
    serializer_class = RoleUpdateSerializer

    permission_classes = (IsAdminOrSuperUser,)

    def patch(self, request, pk):

        role = get_object_or_404(
            Role,
            pk=pk,
        )

        serializer = self.get_serializer(
            role,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(
            raise_exception=True,
        )

        serializer.save()

        cache.delete(f"role:{pk}")
        cache.clear()

        return Response(RoleSerializer(role).data)


class RoleDeleteAPIView(GenericAPIView):
    permission_classes = (IsAdminOrSuperUser,)

    def delete(self, request, pk):

        role = get_object_or_404(
            Role,
            pk=pk,
        )

        role.delete()

        cache.delete(f"role:{pk}")

        cache.clear()

        return Response(status=status.HTTP_204_NO_CONTENT)


class UserCreateAPIView(GenericAPIView):
    serializer_class = UserCreateSerializer

    permission_classes = (IsAdminOrSuperUser,)

    def post(self, request):

        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        return Response(
            UserDetailSerializer(user, context=self.get_serializer_context()).data,
            status=status.HTTP_200_OK,
        )


class UserUpdateAPIView(GenericAPIView):
    serializer_class = UserUpdateSerializer

    permission_classes = (IsAdminOrSuperUser,)

    def get_object(self):

        return get_object_or_404(User, pk=self.kwargs["pk"])

    def patch(self, request, pk):

        user = self.get_object()

        serializer = self.get_serializer(user, data=request.data, partial=True)

        serializer.is_valid(raise_exception=True)

        user = serializer.save()

        return Response(
            UserDetailSerializer(user, context=self.get_serializer_context()).data
        )


class CurrentUserAPIView(RetrieveAPIView):
    serializer_class = UserDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class UserListAPIView(GenericAPIView):
    serializer_class = UserListSerializer

    permission_classes = (IsAdminOrSuperUser,)

    queryset = User.objects.select_related(
        "club",
        "address",
    ).all()

    filter_backends = (
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    )

    search_fields = (
        "username",
        "first_name",
        "last_name",
        "email",
        "phone_number",
    )

    ordering_fields = (
        "id",
        "username",
        "first_name",
        "last_name",
        "created_at",
    )

    ordering = ("-id",)

    def get(self, request):

        # cache_key = f"users:list:{request.get_full_path()}"
        cache_key = None

        # cached_data = cache.get(cache_key)
        cached_data = None

        if cached_data is not None:
            return Response(cached_data)

        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)

        serializer = self.get_serializer(page, many=True)

        response = self.get_paginated_response(serializer.data)

        # cache.set(cache_key, response.data, timeout=300)

        return response


class UserDetailAPIView(GenericAPIView):
    serializer_class = UserDetailSerializer

    permission_classes = (IsAdminOrSuperUser,)

    def get(self, request, pk):

        cache_key = f"user:detail:{pk}"

        cached_data = cache.get(cache_key)

        if cached_data:
            return Response(cached_data)

        user = get_object_or_404(
            User.objects.select_related(
                "club",
                "address",
            ).prefetch_related(
                "informations",
            ),
            pk=pk,
        )

        serializer = self.get_serializer(user)

        cache.set(cache_key, serializer.data, timeout=300)

        return Response(serializer.data)


class UserDeleteAPIView(GenericAPIView):
    permission_classes = (IsAdminOrSuperUser,)

    def delete(self, request, pk):

        user = get_object_or_404(User, pk=pk)

        user_id = user.id

        user.delete()

        # invalidate cache
        cache.delete(f"user:detail:{user_id}")

        return Response(
            {"message": "کاربر با موفقیت حذف شد."}, status=status.HTTP_200_OK
        )


import json


class StaffCreateAPIView(GenericAPIView):
    serializer_class = StaffCreateSerializer

    permission_classes = (IsAdminOrSuperUser,)

    parser_classes = (JSONParser, MultiPartParser, FormParser)

    def post(self, request):
        if "data" in request.data:
            payload = json.loads(request.data["data"])
            self._inject_files(payload, request.FILES, "")
        else:
            payload = request.data

        serializer = self.get_serializer(data=payload)
        serializer.is_valid(raise_exception=True)
        staff = serializer.save()
        return Response(
            StaffDetailSerializer(staff, context=self.get_serializer_context()).data,
            status=status.HTTP_201_CREATED,
        )

    def _inject_files(self, obj, files_dict, path):
        if isinstance(obj, dict):
            for key, value in obj.items():
                new_path = f"{path}[{key}]" if path else key
                if (
                    isinstance(value, str)
                    and value.startswith("__FILE__")
                    and new_path in files_dict
                ):
                    obj[key] = files_dict[new_path]
                else:
                    self._inject_files(value, files_dict, new_path)
        elif isinstance(obj, list):
            for i, item in enumerate(obj):
                self._inject_files(item, files_dict, f"{path}[{i}]")


class StaffUpdateAPIView(GenericAPIView):
    serializer_class = StaffUpdateSerializer

    permission_classes = (IsAdminOrSuperUser,)

    def patch(self, request, pk):

        staff = get_object_or_404(Staff, pk=pk)

        serializer = self.get_serializer(staff, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        staff = serializer.save()

        return Response(
            StaffDetailSerializer(staff, context=self.get_serializer_context()).data,
            status=status.HTTP_200_OK,
        )


class StaffListAPIView(GenericAPIView):
    serializer_class = StaffListSerializer

    permission_classes = [IsAdminOrSuperUser]

    queryset = Staff.objects.select_related(
        "user",
        "user__club",
        "user__address",
    ).prefetch_related("user__user_roles__role")

    filter_backends = (
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    )

    search_fields = (
        "user__username",
        "user__first_name",
        "user__last_name",
        "user__phone_number",
        "employee_code",
        "position",
    )

    ordering_fields = (
        "id",
        "employee_code",
        "hire_date",
        "position",
    )

    ordering = ("-id",)

    def get(self, request):

        cache_key = f"staff:list:{request.get_full_path()}"
        cache_key = None

        # cached = cache.get(cache_key)
        cached = None

        if cached:
            return Response(cached)

        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)

        serializer = self.get_serializer(page, many=True)

        response = self.get_paginated_response(serializer.data)

        # cache.set(cache_key, response.data, timeout=300)

        return response


class StaffDetailAPIView(GenericAPIView):
    serializer_class = StaffDetailSerializer

    permission_classes = (IsAdminOrSuperUser,)

    def get(self, request, pk):

        cache_key = f"staff:detail:{pk}"

        cached = cache.get(cache_key)

        if cached:
            return Response(cached)

        staff = get_object_or_404(
            Staff.objects.select_related(
                "user",
                "user__club",
                "user__address",
            ).prefetch_related(
                "user__user_roles__role",
                "user__informations",
            ),
            pk=pk,
        )

        serializer = self.get_serializer(staff)

        cache.set(cache_key, serializer.data, timeout=300)

        return Response(serializer.data)


class StaffDeleteAPIView(GenericAPIView):
    permission_classes = (IsAdminOrSuperUser,)

    def delete(self, request, pk):

        staff = get_object_or_404(Staff.objects.select_related("user"), pk=pk)

        staff_id = staff.id
        user_id = staff.user.id

        staff.delete()

        # Clear cache
        cache.delete(f"staff:detail:{staff_id}")

        cache.delete(f"user:detail:{user_id}")

        return Response(
            {"message": "کارمند با موفقیت حذف شد."}, status=status.HTTP_200_OK
        )


class RegisterView(GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = (AllowAny,)

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        tokens = get_tokens_for_user(user)

        response = Response(
            {"access": tokens["access"]}, status=status.HTTP_201_CREATED
        )

        response.set_cookie(
            key="refresh_token",
            value=tokens["refresh"],
            httponly=True,
            secure=False,
            samesite="Lax",
            max_age=7 * 24 * 60 * 60,
        )

        return response
