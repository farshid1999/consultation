from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.core.exceptions import ValidationError
from django.db.models import Count
from django.utils import timezone
from django.utils.html import format_html

from .models import (
    OTPCode,
    Information,
    Address,
    Club,
    User,
    Staff,
    UserRole,
    Role,
)


# ============================================================
# Base Admin
# ============================================================

class BaseAdmin(admin.ModelAdmin):
    ordering = ("-created_at",)

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    list_per_page = 50


# ============================================================
# Inline Admins
# ============================================================

class UserRoleInline(admin.TabularInline):
    model = UserRole
    extra = 0

    autocomplete_fields = (
        "role",
    )

    fields = (
        "role",
        "created_at",
        "updated_at",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )


class StaffInline(admin.StackedInline):
    model = Staff
    extra = 0

    fields = (
        "employee_code",
        "hire_date",
        "position",
        "created_at",
        "updated_at",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )


class ClubInline(admin.TabularInline):
    model = Club
    extra = 0

    fields = (
        "name",
        "address",
        "created_at",
        "updated_at",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )


class InformationUserInline(admin.TabularInline):
    model = User.informations.through
    extra = 0

    autocomplete_fields = (
        "information",
    )

    verbose_name = "Information"
    verbose_name_plural = "Informations"


# ============================================================
# OTPCode
# ============================================================

@admin.register(OTPCode)
class OTPCodeAdmin(BaseAdmin):

    list_display = (
        "id",
        "phone_number",
        "code",
        "used_status",
        "expiration_status",
        "expires_at",
        "created_at",
    )

    search_fields = (
        "phone_number",
        "code",
    )

    list_filter = (
        "is_used",
        "expires_at",
        "created_at",
    )

    date_hierarchy = "created_at"

    readonly_fields = (
        "created_at",
        "updated_at",
        "expiration_status",
    )

    fieldsets = (
        (
            "OTP Information",
            {
                "fields": (
                    "phone_number",
                    "code",
                    "is_used",
                    "expires_at",
                )
            },
        ),
        (
            "Status",
            {
                "fields": (
                    "expiration_status",
                )
            },
        ),
        (
            "System Information",
            {
                "fields": (
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )

    @admin.display(description="Used")
    def used_status(self, obj):
        if obj.is_used:
            return format_html(
                '<span style="'
                'background:#198754;'
                'color:white;'
                'padding:4px 9px;'
                'border-radius:12px;'
                'font-size:11px;'
                'font-weight:600;'
                '">Used</span>'
            )

        return format_html(
            '<span style="'
            'background:#fd7e14;'
            'color:white;'
            'padding:4px 9px;'
            'border-radius:12px;'
            'font-size:11px;'
            'font-weight:600;'
            '">Unused</span>'
        )

    @admin.display(description="Expiration")
    def expiration_status(self, obj):
        if obj.is_expired():
            return format_html(
                '<span style="'
                'color:#dc3545;'
                'font-weight:700;'
                '">Expired</span>'
            )

        return format_html(
            '<span style="'
            'color:#198754;'
            'font-weight:700;'
            '">Valid</span>'
        )


# ============================================================
# Information
# ============================================================

@admin.register(Information)
class InformationAdmin(BaseAdmin):

    list_display = (
        "id",
        "title",
        "parent",
        "children_count",
        "users_count",
        "has_file",
        "created_at",
    )

    search_fields = (
        "title",
        "text",
    )

    list_filter = (
        "created_at",
        "updated_at",
    )

    raw_id_fields = (
        "parent",
    )

    date_hierarchy = "created_at"

    fieldsets = (
        (
            "Information",
            {
                "fields": (
                    "title",
                    "text",
                    "file",
                    "parent",
                )
            },
        ),
        (
            "System Information",
            {
                "fields": (
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )

    def get_queryset(self, request):
        queryset = super().get_queryset(request)

        return queryset.annotate(
            _children_count=Count(
                "children",
                distinct=True,
            ),
            _users_count=Count(
                "users",
                distinct=True,
            ),
        )

    @admin.display(
        description="Children",
        ordering="_children_count",
    )
    def children_count(self, obj):
        return obj._children_count

    @admin.display(
        description="Users",
        ordering="_users_count",
    )
    def users_count(self, obj):
        return obj._users_count

    @admin.display(description="File")
    def has_file(self, obj):
        if not obj.file:
            return format_html(
                '<span style="color:#6c757d;">—</span>'
            )

        return format_html(
            '<a href="{}" target="_blank">Open file</a>',
            obj.file.url,
        )


# ============================================================
# Address
# ============================================================

@admin.register(Address)
class AddressAdmin(BaseAdmin):

    list_display = (
        "id",
        "country",
        "province",
        "city",
        "street",
        "postal_code",
        "users_count",
        "clubs_count",
        "created_at",
    )

    search_fields = (
        "country",
        "province",
        "city",
        "street",
        "postal_code",
        "description",
    )

    list_filter = (
        "country",
        "province",
        "city",
        "created_at",
    )

    date_hierarchy = "created_at"

    def get_queryset(self, request):
        queryset = super().get_queryset(request)

        return queryset.annotate(
            _users_count=Count(
                "users",
                distinct=True,
            ),
            _clubs_count=Count(
                "clubs",
                distinct=True,
            ),
        )

    @admin.display(
        description="Users",
        ordering="_users_count",
    )
    def users_count(self, obj):
        return obj._users_count

    @admin.display(
        description="Clubs",
        ordering="_clubs_count",
    )
    def clubs_count(self, obj):
        return obj._clubs_count


# ============================================================
# Club
# ============================================================

@admin.register(Club)
class ClubAdmin(BaseAdmin):

    list_display = (
        "id",
        "name",
        "address",
        "members_count",
        "created_at",
    )

    search_fields = (
        "name",
        "address__country",
        "address__province",
        "address__city",
        "address__street",
    )

    list_filter = (
        "address__country",
        "address__province",
        "created_at",
    )

    autocomplete_fields = (
        "address",
    )

    date_hierarchy = "created_at"

    list_select_related = (
        "address",
    )

    def get_queryset(self, request):
        queryset = super().get_queryset(request)

        return queryset.annotate(
            _members_count=Count(
                "members",
                distinct=True,
            )
        )

    @admin.display(
        description="Members",
        ordering="_members_count",
    )
    def members_count(self, obj):
        return obj._members_count


# ============================================================
# Role
# ============================================================

@admin.register(Role)
class RoleAdmin(BaseAdmin):

    list_display = (
        "id",
        "name",
        "description_preview",
        "users_count",
        "created_at",
    )

    search_fields = (
        "name",
        "description",
    )

    list_filter = (
        "created_at",
        "updated_at",
    )

    date_hierarchy = "created_at"

    inlines = (
        UserRoleInline,
    )

    def get_queryset(self, request):
        queryset = super().get_queryset(request)

        return queryset.annotate(
            _users_count=Count(
                "users",
                distinct=True,
            )
        )

    @admin.display(description="Description")
    def description_preview(self, obj):
        if not obj.description:
            return "-"

        if len(obj.description) > 70:
            return f"{obj.description[:70]}..."

        return obj.description

    @admin.display(
        description="Users",
        ordering="_users_count",
    )
    def users_count(self, obj):
        return obj._users_count


# ============================================================
# UserRole
# ============================================================

@admin.register(UserRole)
class UserRoleAdmin(BaseAdmin):

    list_display = (
        "id",
        "user",
        "role",
        "created_at",
    )

    search_fields = (
        "user__username",
        "user__email",
        "user__phone_number",
        "user__first_name",
        "user__last_name",
        "role__name",
    )

    list_filter = (
        "role",
        "created_at",
    )

    autocomplete_fields = (
        "user",
        "role",
    )

    list_select_related = (
        "user",
        "role",
    )


# ============================================================
# Staff
# ============================================================

class StaffAdminForm(forms.ModelForm):

    class Meta:
        model = Staff
        fields = "__all__"

    def clean(self):
        cleaned_data = super().clean()

        user = cleaned_data.get("user")

        if user and hasattr(user, "staff"):
            if not self.instance.pk or self.instance.user_id != user.id:
                raise ValidationError(
                    {
                        "user": (
                            "This user is already registered "
                            "as a staff member."
                        )
                    }
                )

        return cleaned_data


@admin.register(Staff)
class StaffAdmin(BaseAdmin):

    form = StaffAdminForm

    list_display = (
        "id",
        "employee_code",
        "full_name",
        "phone_number",
        "position",
        "hire_date",
        "created_at",
    )

    search_fields = (
        "employee_code",
        "position",
        "user__username",
        "user__email",
        "user__phone_number",
        "user__first_name",
        "user__last_name",
    )

    list_filter = (
        "position",
        "hire_date",
        "created_at",
    )

    autocomplete_fields = (
        "user",
    )

    date_hierarchy = "hire_date"

    list_select_related = (
        "user",
    )

    fieldsets = (
        (
            "Staff Information",
            {
                "fields": (
                    "user",
                    "employee_code",
                    "position",
                    "hire_date",
                )
            },
        ),
        (
            "System Information",
            {
                "fields": (
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )

    @admin.display(description="Name")
    def full_name(self, obj):
        return obj.user.get_full_name() or obj.user.username

    @admin.display(description="Phone")
    def phone_number(self, obj):
        return obj.user.phone_number


# ============================================================
# User Admin
# ============================================================

@admin.register(User)
class CustomUserAdmin(UserAdmin):

    ordering = (
        "-date_joined",
    )

    list_per_page = 50

    list_display = (
        "id",
        "username",
        "full_name",
        "phone_number",
        "email",
        "club",
        "is_student",
        "staff_status",
        "active_status",
        "date_joined",
    )

    search_fields = (
        "username",
        "first_name",
        "last_name",
        "email",
        "phone_number",
        "land_line",
        "referral_code",
        "degree",
        "job",
        "sport_discipline",
        "club__name",
    )

    list_filter = (
        "is_active",
        "is_staff",
        "is_superuser",
        "is_student",
        "club",
        "date_joined",
        "last_login",
    )

    list_select_related = (
        "address",
        "club",
    )

    autocomplete_fields = (
        "address",
        "club",
    )

    filter_horizontal = (
        "groups",
        "user_permissions",
        "informations",
    )

    inlines = (
        UserRoleInline,
        StaffInline,
    )

    date_hierarchy = "date_joined"

    fieldsets = (
        (
            "Authentication",
            {
                "fields": (
                    "username",
                    "password",
                )
            },
        ),
        (
            "Personal Information",
            {
                "fields": (
                    "first_name",
                    "last_name",
                    "email",
                    "phone_number",
                    "land_line",
                    "avatar",
                    "bio",
                    "birth_date",
                )
            },
        ),
        (
            "Professional / Educational",
            {
                "fields": (
                    "is_student",
                    "degree",
                    "job",
                    "sport_discipline",
                    "professional_background",
                )
            },
        ),
        (
            "Organization",
            {
                "fields": (
                    "club",
                    "address",
                    "referral_code",
                    "informations",
                )
            },
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        (
            "Important Dates",
            {
                "fields": (
                    "last_login",
                    "date_joined",
                )
            },
        ),
    )

    readonly_fields = (
        "last_login",
        "date_joined",
    )

    @admin.display(description="Name")
    def full_name(self, obj):
        return obj.get_full_name() or obj.username

    @admin.display(description="Staff")
    def staff_status(self, obj):
        if hasattr(obj, "staff"):
            return format_html(
                '<span style="'
                'background:#198754;'
                'color:white;'
                'padding:4px 9px;'
                'border-radius:12px;'
                'font-size:11px;'
                'font-weight:600;'
                '">Staff</span>'
            )

        return format_html(
            '<span style="color:#6c757d;">User</span>'
        )

    @admin.display(description="Status")
    def active_status(self, obj):
        if obj.is_active:
            return format_html(
                '<span style="'
                'background:#198754;'
                'color:white;'
                'padding:4px 9px;'
                'border-radius:12px;'
                'font-size:11px;'
                'font-weight:600;'
                '">Active</span>'
            )

        return format_html(
            '<span style="'
            'background:#dc3545;'
            'color:white;'
            'padding:4px 9px;'
            'border-radius:12px;'
            'font-size:11px;'
            'font-weight:600;'
            '">Inactive</span>'
        )


# ============================================================
# Admin Site Configuration
# ============================================================

admin.site.site_header = "Management Administration"
admin.site.site_title = "Management Admin"
admin.site.index_title = "Management Dashboard"
