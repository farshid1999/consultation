from django.urls import path, include

from accounts.Api.v1.view import *



# =========================
# Auth URLs
# =========================

auth_urls = [

    path(
        "login/",
        LoginView.as_view(),
        name="login"
    ),

    path(
        "register/",
        RegisterView.as_view(),
        name="register"
    ),

    path(
        "refresh/",
        RefreshTokenView.as_view(),
        name="refresh-token"
    ),

    path(
        "verify/",
        VerifyTokenView.as_view(),
        name="verify-token"
    ),

    path(
        "logout/",
        LogoutView.as_view(),
        name="logout"
    ),

]



# =========================
# Role URLs
# =========================

role_urls = [

    path(
        "",
        RoleListAPIView.as_view(),
        name="role-list"
    ),

    path(
        "create/",
        RoleCreateAPIView.as_view(),
        name="role-create"
    ),

    path(
        "<int:pk>/",
        RoleDetailAPIView.as_view(),
        name="role-detail"
    ),

    path(
        "<int:pk>/update/",
        RoleUpdateAPIView.as_view(),
        name="role-update"
    ),

    path(
        "<int:pk>/delete/",
        RoleDeleteAPIView.as_view(),
        name="role-delete"
    ),

]



# =========================
# User URLs
# =========================

user_urls = [

    path(
        "",
        UserListAPIView.as_view(),
        name="user-list"
    ),

    path(
        "create/",
        UserCreateAPIView.as_view(),
        name="user-create"
    ),

    path(
        "<int:pk>/",
        UserDetailAPIView.as_view(),
        name="user-detail"
    ),

    path(
        "<int:pk>/update/",
        UserUpdateAPIView.as_view(),
        name="user-update"
    ),

    path(
        "<int:pk>/delete/",
        UserDeleteAPIView.as_view(),
        name="user-delete"
    ),

]



# =========================
# Staff URLs
# =========================

staff_urls = [

    path(
        "",
        StaffListAPIView.as_view(),
        name="staff-list"
    ),

    path(
        "create/",
        StaffCreateAPIView.as_view(),
        name="staff-create"
    ),

    path(
        "<int:pk>/",
        StaffDetailAPIView.as_view(),
        name="staff-detail"
    ),

    path(
        "<int:pk>/update/",
        StaffUpdateAPIView.as_view(),
        name="staff-update"
    ),

    path(
        "<int:pk>/delete/",
        StaffDeleteAPIView.as_view(),
        name="staff-delete"
    ),

]



# =========================
# Main URL List
# =========================
urlpatterns = [

    path(
        "auth/",
        include(auth_urls)
    ),


    path(
        "roles/",
        include(role_urls)
    ),


    path(
        "users/",
        include(user_urls)
    ),


    path(
        "staff/",
        include(staff_urls)
    ),

]