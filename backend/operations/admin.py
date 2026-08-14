from django import forms
from django.contrib import admin
from django.core.exceptions import ValidationError
from django.db.models import Count
from django.utils.html import format_html

from .models import (
    InviteRule,
    Line,
    LineMember,
    StaffLine,
    Media,
    Assignment,
    AssignmentMedia,
    AssignmentRecipient,
    AssignmentSubmission,
    SubmissionMedia,
    Conversation,
    ConversationParticipant,
    Message,
    ConsultationForm,
    Appointment,
    Feature,
    Content,
)


# ============================================================
# Admin Helpers
# ============================================================

class BaseAdmin(admin.ModelAdmin):
    """
    Base admin configuration shared between all models.
    """

    ordering = ("-created_at",)

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    list_per_page = 50


# ============================================================
# Inline Admins
# ============================================================

class LineMemberInline(admin.TabularInline):
    model = LineMember
    extra = 0

    raw_id_fields = (
        "user",
    )

    fields = (
        "user",
        "created_at",
        "updated_at",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )


class StaffLineInline(admin.TabularInline):
    model = StaffLine
    extra = 0

    raw_id_fields = (
        "staff",
    )

    fields = (
        "staff",
        "created_at",
        "updated_at",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )


class AssignmentMediaInline(admin.TabularInline):
    model = AssignmentMedia
    extra = 0

    raw_id_fields = (
        "media",
    )

    fields = (
        "media",
        "created_at",
        "updated_at",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )


class AssignmentRecipientInline(admin.TabularInline):
    model = AssignmentRecipient
    extra = 0

    raw_id_fields = (
        "member",
    )

    fields = (
        "member",
        "created_at",
        "updated_at",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )


class SubmissionMediaInline(admin.TabularInline):
    model = SubmissionMedia
    extra = 0

    raw_id_fields = (
        "media",
    )

    fields = (
        "media",
        "created_at",
        "updated_at",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )


class ConversationParticipantInline(admin.TabularInline):
    model = ConversationParticipant
    extra = 0

    raw_id_fields = (
        "user",
    )

    fields = (
        "user",
        "created_at",
        "updated_at",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )


class MessageInline(admin.TabularInline):
    model = Message
    extra = 0

    raw_id_fields = (
        "sender",
        "media",
    )

    fields = (
        "sender",
        "media",
        "created_at",
        "updated_at",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )


# ============================================================
# InviteRule
# ============================================================

@admin.register(InviteRule)
class InviteRuleAdmin(BaseAdmin):

    list_display = (
        "id",
        "created_at",
        "updated_at",
    )

    search_fields = (
        "id",
    )

    list_filter = (
        "created_at",
        "updated_at",
    )

    date_hierarchy = "created_at"


# ============================================================
# Line
# ============================================================

@admin.register(Line)
class LineAdmin(BaseAdmin):

    list_display = (
        "id",
        "title",
        "parent",
        "members_count",
        "staff_count",
        "assignments_count",
        "conversations_count",
        "appointments_count",
        "created_at",
    )

    search_fields = (
        "title",
        "descriptions",
    )

    list_filter = (
        "created_at",
        "updated_at",
    )

    autocomplete_fields = (
        "parent",
    )

    date_hierarchy = "created_at"

    inlines = (
        LineMemberInline,
        StaffLineInline,
    )

    fieldsets = (
        (
            "Line Information",
            {
                "fields": (
                    "title",
                    "descriptions",
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
            _members_count=Count(
                "members",
                distinct=True,
            ),
            _staff_count=Count(
                "staff_memberships",
                distinct=True,
            ),
            _assignments_count=Count(
                "assignments",
                distinct=True,
            ),
            _conversations_count=Count(
                "conversations",
                distinct=True,
            ),
            _appointments_count=Count(
                "appointments",
                distinct=True,
            ),
        )

    @admin.display(
        description="Members",
        ordering="_members_count",
    )
    def members_count(self, obj):
        return obj._members_count

    @admin.display(
        description="Staff",
        ordering="_staff_count",
    )
    def staff_count(self, obj):
        return obj._staff_count

    @admin.display(
        description="Assignments",
        ordering="_assignments_count",
    )
    def assignments_count(self, obj):
        return obj._assignments_count

    @admin.display(
        description="Conversations",
        ordering="_conversations_count",
    )
    def conversations_count(self, obj):
        return obj._conversations_count

    @admin.display(
        description="Appointments",
        ordering="_appointments_count",
    )
    def appointments_count(self, obj):
        return obj._appointments_count


# ============================================================
# LineMember
# ============================================================

@admin.register(LineMember)
class LineMemberAdmin(BaseAdmin):

    list_display = (
        "id",
        "user",
        "line",
        "created_at",
    )

    search_fields = (
        "user__username",
        "user__email",
        "user__first_name",
        "user__last_name",
        "line__title",
    )

    list_filter = (
        "line",
        "created_at",
    )

    raw_id_fields = (
        "user",
        "line",
    )

    date_hierarchy = "created_at"

    list_select_related = (
        "user",
        "line",
    )


# ============================================================
# StaffLine
# ============================================================

@admin.register(StaffLine)
class StaffLineAdmin(BaseAdmin):

    list_display = (
        "id",
        "staff",
        "line",
        "created_at",
    )

    search_fields = (
        "line__title",
    )

    list_filter = (
        "line",
        "created_at",
    )

    raw_id_fields = (
        "staff",
        "line",
    )

    date_hierarchy = "created_at"

    list_select_related = (
        "staff",
        "line",
    )


# ============================================================
# Media
# ============================================================

@admin.register(Media)
class MediaAdmin(BaseAdmin):

    list_display = (
        "id",
        "preview",
        "has_file",
        "file_name",
        "text_preview",
        "created_at",
    )

    search_fields = (
        "text",
        "file",
    )

    list_filter = (
        "created_at",
        "updated_at",
    )

    date_hierarchy = "created_at"

    fieldsets = (
        (
            "Content",
            {
                "fields": (
                    "text",
                    "file",
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

    @admin.display(description="File")
    def has_file(self, obj):
        if obj.file:
            return format_html(
                '<span style="color:#198754;font-weight:600;">✓ Yes</span>'
            )

        return format_html(
            '<span style="color:#dc3545;font-weight:600;">✗ No</span>'
        )

    @admin.display(description="File Name")
    def file_name(self, obj):
        if not obj.file:
            return "-"

        return obj.file.name.split("/")[-1]

    @admin.display(description="Text")
    def text_preview(self, obj):
        if not obj.text:
            return "-"

        if len(obj.text) > 70:
            return f"{obj.text[:70]}..."

        return obj.text

    @admin.display(description="Preview")
    def preview(self, obj):
        if not obj.file:
            return "-"

        try:
            url = obj.file.url
        except ValueError:
            return "-"

        return format_html(
            '<a href="{}" target="_blank">Open</a>',
            url,
        )


# ============================================================
# Assignment
# ============================================================

@admin.register(Assignment)
class AssignmentAdmin(BaseAdmin):

    list_display = (
        "id",
        "title",
        "line",
        "parent",
        "recipients_count",
        "media_count",
        "children_count",
        "created_at",
    )

    search_fields = (
        "title",
        "description",
        "line__title",
    )

    list_filter = (
        "line",
        "created_at",
        "updated_at",
    )

    raw_id_fields = (
        "line",
        "parent",
    )

    date_hierarchy = "created_at"

    inlines = (
        AssignmentMediaInline,
        AssignmentRecipientInline,
    )

    list_select_related = (
        "line",
        "parent",
    )

    fieldsets = (
        (
            "Assignment",
            {
                "fields": (
                    "line",
                    "title",
                    "description",
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
            _recipients_count=Count(
                "recipients",
                distinct=True,
            ),
            _media_count=Count(
                "media_items",
                distinct=True,
            ),
            _children_count=Count(
                "children",
                distinct=True,
            ),
        )

    @admin.display(
        description="Recipients",
        ordering="_recipients_count",
    )
    def recipients_count(self, obj):
        return obj._recipients_count

    @admin.display(
        description="Media",
        ordering="_media_count",
    )
    def media_count(self, obj):
        return obj._media_count

    @admin.display(
        description="Children",
        ordering="_children_count",
    )
    def children_count(self, obj):
        return obj._children_count


# ============================================================
# AssignmentMedia
# ============================================================

@admin.register(AssignmentMedia)
class AssignmentMediaAdmin(BaseAdmin):

    list_display = (
        "id",
        "assignment",
        "media",
        "created_at",
    )

    search_fields = (
        "assignment__title",
        "assignment__line__title",
        "media__text",
        "media__file",
    )

    list_filter = (
        "assignment__line",
        "created_at",
    )

    raw_id_fields = (
        "assignment",
        "media",
    )

    list_select_related = (
        "assignment",
        "media",
    )


# ============================================================
# AssignmentRecipient
# ============================================================

@admin.register(AssignmentRecipient)
class AssignmentRecipientAdmin(BaseAdmin):

    list_display = (
        "id",
        "assignment",
        "member",
        "user",
        "line",
        "submission_status",
        "created_at",
    )

    search_fields = (
        "assignment__title",
        "member__user__username",
        "member__user__email",
        "member__user__first_name",
        "member__user__last_name",
        "member__line__title",
    )

    list_filter = (
        "assignment__line",
        "created_at",
    )

    raw_id_fields = (
        "assignment",
        "member",
    )

    list_select_related = (
        "assignment",
        "member",
        "member__user",
        "member__line",
    )

    @admin.display(description="User")
    def user(self, obj):
        return obj.member.user

    @admin.display(description="Line")
    def line(self, obj):
        return obj.member.line

    @admin.display(description="Submission")
    def submission_status(self, obj):
        exists = hasattr(obj, "submission")

        if exists:
            return format_html(
                '<span style="color:#198754;font-weight:600;">Submitted</span>'
            )

        return format_html(
            '<span style="color:#dc3545;font-weight:600;">Pending</span>'
        )


# ============================================================
# AssignmentSubmission
# ============================================================

@admin.register(AssignmentSubmission)
class AssignmentSubmissionAdmin(BaseAdmin):

    list_display = (
        "id",
        "assignment",
        "member",
        "user",
        "media_count",
        "created_at",
    )

    search_fields = (
        "assignment_recipient__assignment__title",
        "assignment_recipient__member__user__username",
        "assignment_recipient__member__user__email",
        "assignment_recipient__member__user__first_name",
        "assignment_recipient__member__user__last_name",
    )

    list_filter = (
        "assignment_recipient__assignment__line",
        "created_at",
    )

    raw_id_fields = (
        "assignment_recipient",
    )

    list_select_related = (
        "assignment_recipient",
        "assignment_recipient__assignment",
        "assignment_recipient__member",
        "assignment_recipient__member__user",
    )

    inlines = (
        SubmissionMediaInline,
    )

    @admin.display(description="Assignment")
    def assignment(self, obj):
        return obj.assignment_recipient.assignment

    @admin.display(description="Member")
    def member(self, obj):
        return obj.assignment_recipient.member

    @admin.display(description="User")
    def user(self, obj):
        return obj.assignment_recipient.member.user

    @admin.display(description="Media")
    def media_count(self, obj):
        return obj.media_items.count()


# ============================================================
# SubmissionMedia
# ============================================================

@admin.register(SubmissionMedia)
class SubmissionMediaAdmin(BaseAdmin):

    list_display = (
        "id",
        "submission",
        "assignment",
        "media",
        "created_at",
    )

    search_fields = (
        "submission__assignment_recipient__assignment__title",
        "submission__assignment_recipient__member__user__username",
        "submission__assignment_recipient__member__user__email",
        "media__text",
        "media__file",
    )

    list_filter = (
        "submission__assignment_recipient__assignment__line",
        "created_at",
    )

    raw_id_fields = (
        "submission",
        "media",
    )

    list_select_related = (
        "submission",
        "media",
    )

    @admin.display(description="Assignment")
    def assignment(self, obj):
        return obj.submission.assignment_recipient.assignment


# ============================================================
# Conversation
# ============================================================

@admin.register(Conversation)
class ConversationAdmin(BaseAdmin):

    list_display = (
        "id",
        "line",
        "participants_count",
        "messages_count",
        "created_at",
    )

    search_fields = (
        "line__title",
        "participants__user__username",
        "participants__user__email",
        "participants__user__first_name",
        "participants__user__last_name",
    )

    list_filter = (
        "line",
        "created_at",
        "updated_at",
    )

    raw_id_fields = (
        "line",
    )

    date_hierarchy = "created_at"

    inlines = (
        ConversationParticipantInline,
        MessageInline,
    )

    list_select_related = (
        "line",
    )

    def get_queryset(self, request):
        queryset = super().get_queryset(request)

        return queryset.annotate(
            _participants_count=Count(
                "participants",
                distinct=True,
            ),
            _messages_count=Count(
                "messages",
                distinct=True,
            ),
        )

    @admin.display(
        description="Participants",
        ordering="_participants_count",
    )
    def participants_count(self, obj):
        return obj._participants_count

    @admin.display(
        description="Messages",
        ordering="_messages_count",
    )
    def messages_count(self, obj):
        return obj._messages_count


# ============================================================
# ConversationParticipant
# ============================================================

@admin.register(ConversationParticipant)
class ConversationParticipantAdmin(BaseAdmin):

    list_display = (
        "id",
        "conversation",
        "user",
        "line",
        "messages_count",
        "created_at",
    )

    search_fields = (
        "conversation__line__title",
        "user__username",
        "user__email",
        "user__first_name",
        "user__last_name",
    )

    list_filter = (
        "conversation__line",
        "created_at",
    )

    raw_id_fields = (
        "conversation",
        "user",
    )

    list_select_related = (
        "conversation",
        "conversation__line",
        "user",
    )

    @admin.display(description="Line")
    def line(self, obj):
        return obj.conversation.line

    @admin.display(description="Messages")
    def messages_count(self, obj):
        return obj.sent_messages.count()


# ============================================================
# Message
# ============================================================

class MessageAdminForm(forms.ModelForm):

    class Meta:
        model = Message
        fields = "__all__"

    def clean(self):
        cleaned_data = super().clean()

        conversation = cleaned_data.get("conversation")
        sender = cleaned_data.get("sender")

        if conversation and sender:
            if sender.conversation_id != conversation.id:
                raise ValidationError(
                    {
                        "sender": (
                            "The selected sender does not belong "
                            "to the selected conversation."
                        )
                    }
                )

        return cleaned_data


@admin.register(Message)
class MessageAdmin(BaseAdmin):

    form = MessageAdminForm

    list_display = (
        "id",
        "conversation",
        "sender_user",
        "message_content",
        "has_media",
        "created_at",
    )

    search_fields = (
        "conversation__line__title",
        "sender__user__username",
        "sender__user__email",
        "sender__user__first_name",
        "sender__user__last_name",
        "media__text",
        "media__file",
    )

    list_filter = (
        "conversation__line",
        "created_at",
        "updated_at",
    )

    raw_id_fields = (
        "conversation",
        "sender",
        "media",
    )

    date_hierarchy = "created_at"

    list_select_related = (
        "conversation",
        "conversation__line",
        "sender",
        "sender__user",
        "media",
    )

    @admin.display(description="Sender")
    def sender_user(self, obj):
        return obj.sender.user

    @admin.display(description="Content")
    def message_content(self, obj):
        if obj.media and obj.media.text:
            text = obj.media.text

            if len(text) > 80:
                return f"{text[:80]}..."

            return text

        if obj.media and obj.media.file:
            return "📎 File"

        return "—"

    @admin.display(description="Media")
    def has_media(self, obj):
        if obj.media:
            return format_html(
                '<span style="color:#198754;font-weight:600;">✓ Yes</span>'
            )

        return format_html(
            '<span style="color:#6c757d;">—</span>'
        )


# ============================================================
# ConsultationForm
# ============================================================

@admin.register(ConsultationForm)
class ConsultationFormAdmin(BaseAdmin):

    list_display = (
        "id",
        "title",
        "line",
        "file_link",
        "created_at",
    )

    search_fields = (
        "title",
        "description",
        "line__title",
    )

    list_filter = (
        "line",
        "created_at",
        "updated_at",
    )

    raw_id_fields = (
        "line",
    )

    date_hierarchy = "created_at"

    list_select_related = (
        "line",
    )

    @admin.display(description="File")
    def file_link(self, obj):
        if not obj.file:
            return "-"

        try:
            url = obj.file.url
        except ValueError:
            return "-"

        return format_html(
            '<a href="{}" target="_blank">Open file</a>',
            url,
        )


# ============================================================
# Appointment
# ============================================================

class AppointmentAdminForm(forms.ModelForm):

    class Meta:
        model = Appointment
        fields = "__all__"

    def clean(self):
        cleaned_data = super().clean()

        line = cleaned_data.get("line")
        member = cleaned_data.get("member")

        if line and member:
            if member.line_id != line.id:
                raise ValidationError(
                    {
                        "member": (
                            "The selected member does not belong "
                            "to the selected line."
                        )
                    }
                )

        return cleaned_data


@admin.register(Appointment)
class AppointmentAdmin(BaseAdmin):

    form = AppointmentAdminForm

    list_display = (
        "id",
        "line",
        "member_user",
        "staff",
        "status_badge",
        "appointment_time",
        "created_at",
    )

    search_fields = (
        "line__title",
        "member__user__username",
        "member__user__email",
        "member__user__first_name",
        "member__user__last_name",
        "staff__user__username",
        "staff__user__email",
    )

    list_filter = (
        "line",
        "status",
        "appointment_time",
        "created_at",
    )

    raw_id_fields = (
        "line",
        "member",
        "staff",
    )

    date_hierarchy = "appointment_time"

    list_select_related = (
        "line",
        "member",
        "member__user",
        "staff",
    )

    @admin.display(description="Member")
    def member_user(self, obj):
        return obj.member.user

    @admin.display(description="Status")
    def status_badge(self, obj):
        status = (obj.status or "").lower()

        if status in {
            "completed",
            "approved",
            "confirmed",
            "done",
        }:
            color = "#198754"

        elif status in {
            "cancelled",
            "canceled",
            "rejected",
            "failed",
        }:
            color = "#dc3545"

        elif status in {
            "pending",
            "waiting",
        }:
            color = "#fd7e14"

        else:
            color = "#6c757d"

        return format_html(
            '<span style="'
            'background:{};'
            'color:white;'
            'padding:4px 9px;'
            'border-radius:12px;'
            'font-size:11px;'
            'font-weight:600;'
            '">'
            '{}'
            '</span>',
            color,
            obj.status or "Unknown",
        )


# ============================================================
# Feature
# ============================================================

@admin.register(Feature)
class FeatureAdmin(BaseAdmin):

    list_display = (
        "id",
        "title",
        "line",
        "parent",
        "has_media",
        "children_count",
        "created_at",
    )

    search_fields = (
        "title",
        "text",
        "line__title",
    )

    list_filter = (
        "line",
        "created_at",
        "updated_at",
    )

    raw_id_fields = (
        "line",
        "parent",
        "media",
    )

    date_hierarchy = "created_at"

    list_select_related = (
        "line",
        "parent",
        "media",
    )

    def get_queryset(self, request):
        queryset = super().get_queryset(request)

        return queryset.annotate(
            _children_count=Count(
                "children",
                distinct=True,
            )
        )

    @admin.display(description="Media")
    def has_media(self, obj):
        if obj.media:
            return format_html(
                '<span style="color:#198754;font-weight:600;">✓</span>'
            )

        return format_html(
            '<span style="color:#6c757d;">—</span>'
        )

    @admin.display(
        description="Children",
        ordering="_children_count",
    )
    def children_count(self, obj):
        return obj._children_count


# ============================================================
# Content
# ============================================================

@admin.register(Content)
class ContentAdmin(BaseAdmin):

    list_display = (
        "id",
        "title",
        "line",
        "member_user",
        "parent",
        "has_media",
        "children_count",
        "created_at",
    )

    search_fields = (
        "title",
        "text",
        "line__title",
        "member__user__username",
        "member__user__email",
        "member__user__first_name",
        "member__user__last_name",
    )

    list_filter = (
        "line",
        "created_at",
        "updated_at",
    )

    raw_id_fields = (
        "line",
        "parent",
        "member",
        "media",
    )

    date_hierarchy = "created_at"

    list_select_related = (
        "line",
        "parent",
        "member",
        "member__user",
        "media",
    )

    def get_queryset(self, request):
        queryset = super().get_queryset(request)

        return queryset.annotate(
            _children_count=Count(
                "children",
                distinct=True,
            )
        )

    @admin.display(description="Member")
    def member_user(self, obj):
        if not obj.member:
            return "-"

        return obj.member.user

    @admin.display(description="Media")
    def has_media(self, obj):
        if obj.media:
            return format_html(
                '<span style="color:#198754;font-weight:600;">✓</span>'
            )

        return format_html(
            '<span style="color:#6c757d;">—</span>'
        )

    @admin.display(
        description="Children",
        ordering="_children_count",
    )
    def children_count(self, obj):
        return obj._children_count