# from django import forms
# from django.contrib import admin
# from django.core.exceptions import ValidationError
# from django.db.models import Count
# from django.utils.html import format_html
#
# from .models import (
#     InviteRule,
#     Line,
#     LineMember,
#     StaffLine,
#     Media,
#     Assignment,
#     AssignmentMedia,
#     AssignmentRecipient,
#     AssignmentSubmission,
#     SubmissionMedia,
#     Conversation,
#     ConversationParticipant,
#     Message,
#     ConsultationForm,
#     Appointment,
#     Feature,
#     Content,
# )
#
#
# # ============================================================
# # Admin Helpers
# # ============================================================
#
# class BaseAdmin(admin.ModelAdmin):
#     """
#     Base admin configuration shared between all models.
#     """
#
#     ordering = ("-created_at",)
#
#     readonly_fields = (
#         "created_at",
#         "updated_at",
#     )
#
#     list_per_page = 50
#
#
# # ============================================================
# # Inline Admins
# # ============================================================
#
# class LineMemberInline(admin.TabularInline):
#     model = LineMember
#     extra = 0
#
#     raw_id_fields = (
#         "user",
#     )
#
#     fields = (
#         "user",
#         "created_at",
#         "updated_at",
#     )
#
#     readonly_fields = (
#         "created_at",
#         "updated_at",
#     )
#
#
# class StaffLineInline(admin.TabularInline):
#     model = StaffLine
#     extra = 0
#
#     raw_id_fields = (
#         "staff",
#     )
#
#     fields = (
#         "staff",
#         "created_at",
#         "updated_at",
#     )
#
#     readonly_fields = (
#         "created_at",
#         "updated_at",
#     )
#
#
# class AssignmentMediaInline(admin.TabularInline):
#     model = AssignmentMedia
#     extra = 0
#
#     raw_id_fields = (
#         "media",
#     )
#
#     fields = (
#         "media",
#         "created_at",
#         "updated_at",
#     )
#
#     readonly_fields = (
#         "created_at",
#         "updated_at",
#     )
#
#
# class AssignmentRecipientInline(admin.TabularInline):
#     model = AssignmentRecipient
#     extra = 0
#
#     raw_id_fields = (
#         "member",
#     )
#
#     fields = (
#         "member",
#         "created_at",
#         "updated_at",
#     )
#
#     readonly_fields = (
#         "created_at",
#         "updated_at",
#     )
#
#
# class SubmissionMediaInline(admin.TabularInline):
#     model = SubmissionMedia
#     extra = 0
#
#     raw_id_fields = (
#         "media",
#     )
#
#     fields = (
#         "media",
#         "created_at",
#         "updated_at",
#     )
#
#     readonly_fields = (
#         "created_at",
#         "updated_at",
#     )
#
#
# class ConversationParticipantInline(admin.TabularInline):
#     model = ConversationParticipant
#     extra = 0
#
#     raw_id_fields = (
#         "user",
#     )
#
#     fields = (
#         "user",
#         "created_at",
#         "updated_at",
#     )
#
#     readonly_fields = (
#         "created_at",
#         "updated_at",
#     )
#
#
# class MessageInline(admin.TabularInline):
#     model = Message
#     extra = 0
#
#     raw_id_fields = (
#         "sender",
#         "media",
#     )
#
#     fields = (
#         "sender",
#         "media",
#         "created_at",
#         "updated_at",
#     )
#
#     readonly_fields = (
#         "created_at",
#         "updated_at",
#     )
#
#
# # ============================================================
# # InviteRule
# # ============================================================
#
# @admin.register(InviteRule)
# class InviteRuleAdmin(BaseAdmin):
#
#     list_display = (
#         "id",
#         "created_at",
#         "updated_at",
#     )
#
#     search_fields = (
#         "id",
#     )
#
#     list_filter = (
#         "created_at",
#         "updated_at",
#     )
#
#     date_hierarchy = "created_at"
#
#
# # ============================================================
# # Line
# # ============================================================
#
# @admin.register(Line)
# class LineAdmin(BaseAdmin):
#
#     list_display = (
#         "id",
#         "title",
#         "parent",
#         "members_count",
#         "staff_count",
#         "assignments_count",
#         "conversations_count",
#         "appointments_count",
#         "created_at",
#     )
#
#     search_fields = (
#         "title",
#         "descriptions",
#     )
#
#     list_filter = (
#         "created_at",
#         "updated_at",
#     )
#
#     autocomplete_fields = (
#         "parent",
#     )
#
#     date_hierarchy = "created_at"
#
#     inlines = (
#         LineMemberInline,
#         StaffLineInline,
#     )
#
#     fieldsets = (
#         (
#             "Line Information",
#             {
#                 "fields": (
#                     "title",
#                     "descriptions",
#                     "parent",
#                 )
#             },
#         ),
#         (
#             "System Information",
#             {
#                 "fields": (
#                     "created_at",
#                     "updated_at",
#                 )
#             },
#         ),
#     )
#
#     def get_queryset(self, request):
#         queryset = super().get_queryset(request)
#
#         return queryset.annotate(
#             _members_count=Count(
#                 "members",
#                 distinct=True,
#             ),
#             _staff_count=Count(
#                 "staff_memberships",
#                 distinct=True,
#             ),
#             _assignments_count=Count(
#                 "assignments",
#                 distinct=True,
#             ),
#             _conversations_count=Count(
#                 "conversations",
#                 distinct=True,
#             ),
#             _appointments_count=Count(
#                 "appointments",
#                 distinct=True,
#             ),
#         )
#
#     @admin.display(
#         description="Members",
#         ordering="_members_count",
#     )
#     def members_count(self, obj):
#         return obj._members_count
#
#     @admin.display(
#         description="Staff",
#         ordering="_staff_count",
#     )
#     def staff_count(self, obj):
#         return obj._staff_count
#
#     @admin.display(
#         description="Assignments",
#         ordering="_assignments_count",
#     )
#     def assignments_count(self, obj):
#         return obj._assignments_count
#
#     @admin.display(
#         description="Conversations",
#         ordering="_conversations_count",
#     )
#     def conversations_count(self, obj):
#         return obj._conversations_count
#
#     @admin.display(
#         description="Appointments",
#         ordering="_appointments_count",
#     )
#     def appointments_count(self, obj):
#         return obj._appointments_count
#
#
# # ============================================================
# # LineMember
# # ============================================================
#
# @admin.register(LineMember)
# class LineMemberAdmin(BaseAdmin):
#
#     list_display = (
#         "id",
#         "user",
#         "line",
#         "created_at",
#     )
#
#     search_fields = (
#         "user__username",
#         "user__email",
#         "user__first_name",
#         "user__last_name",
#         "line__title",
#     )
#
#     list_filter = (
#         "line",
#         "created_at",
#     )
#
#     raw_id_fields = (
#         "user",
#         "line",
#     )
#
#     date_hierarchy = "created_at"
#
#     list_select_related = (
#         "user",
#         "lines",
#     )
#
#
# # ============================================================
# # StaffLine
# # ============================================================
#
# @admin.register(StaffLine)
# class StaffLineAdmin(BaseAdmin):
#
#     list_display = (
#         "id",
#         "staff",
#         "line",
#         "created_at",
#     )
#
#     search_fields = (
#         "line__title",
#     )
#
#     list_filter = (
#         "line",
#         "created_at",
#     )
#
#     raw_id_fields = (
#         "staff",
#         "line",
#     )
#
#     date_hierarchy = "created_at"
#
#     list_select_related = (
#         "staff",
#         "lines",
#     )
#
#
# # ============================================================
# # Media
# # ============================================================
#
# @admin.register(Media)
# class MediaAdmin(BaseAdmin):
#
#     list_display = (
#         "id",
#         "preview",
#         "has_file",
#         "file_name",
#         "text_preview",
#         "created_at",
#     )
#
#     search_fields = (
#         "text",
#         "file",
#     )
#
#     list_filter = (
#         "created_at",
#         "updated_at",
#     )
#
#     date_hierarchy = "created_at"
#
#     fieldsets = (
#         (
#             "Content",
#             {
#                 "fields": (
#                     "text",
#                     "file",
#                 )
#             },
#         ),
#         (
#             "System Information",
#             {
#                 "fields": (
#                     "created_at",
#                     "updated_at",
#                 )
#             },
#         ),
#     )
#
#     @admin.display(description="File")
#     def has_file(self, obj):
#         if obj.file:
#             return format_html(
#                 '<span style="color:#198754;font-weight:600;">✓ Yes</span>'
#             )
#
#         return format_html(
#             '<span style="color:#dc3545;font-weight:600;">✗ No</span>'
#         )
#
#     @admin.display(description="File Name")
#     def file_name(self, obj):
#         if not obj.file:
#             return "-"
#
#         return obj.file.name.split("/")[-1]
#
#     @admin.display(description="Text")
#     def text_preview(self, obj):
#         if not obj.text:
#             return "-"
#
#         if len(obj.text) > 70:
#             return f"{obj.text[:70]}..."
#
#         return obj.text
#
#     @admin.display(description="Preview")
#     def preview(self, obj):
#         if not obj.file:
#             return "-"
#
#         try:
#             url = obj.file.url
#         except ValueError:
#             return "-"
#
#         return format_html(
#             '<a href="{}" target="_blank">Open</a>',
#             url,
#         )
#
#
# # ============================================================
# # Assignment
# # ============================================================
#
# @admin.register(Assignment)
# class AssignmentAdmin(BaseAdmin):
#
#     list_display = (
#         "id",
#         "title",
#         "line",
#         "parent",
#         "recipients_count",
#         "media_count",
#         "children_count",
#         "created_at",
#     )
#
#     search_fields = (
#         "title",
#         "description",
#         "line__title",
#     )
#
#     list_filter = (
#         "line",
#         "created_at",
#         "updated_at",
#     )
#
#     raw_id_fields = (
#         "line",
#         "parent",
#     )
#
#     date_hierarchy = "created_at"
#
#     inlines = (
#         AssignmentMediaInline,
#         AssignmentRecipientInline,
#     )
#
#     list_select_related = (
#         "lines",
#         "parent",
#     )
#
#     fieldsets = (
#         (
#             "Assignment",
#             {
#                 "fields": (
#                     "line",
#                     "title",
#                     "description",
#                     "parent",
#                 )
#             },
#         ),
#         (
#             "System Information",
#             {
#                 "fields": (
#                     "created_at",
#                     "updated_at",
#                 )
#             },
#         ),
#     )
#
#     def get_queryset(self, request):
#         queryset = super().get_queryset(request)
#
#         return queryset.annotate(
#             _recipients_count=Count(
#                 "recipients",
#                 distinct=True,
#             ),
#             _media_count=Count(
#                 "media_items",
#                 distinct=True,
#             ),
#             _children_count=Count(
#                 "children",
#                 distinct=True,
#             ),
#         )
#
#     @admin.display(
#         description="Recipients",
#         ordering="_recipients_count",
#     )
#     def recipients_count(self, obj):
#         return obj._recipients_count
#
#     @admin.display(
#         description="Media",
#         ordering="_media_count",
#     )
#     def media_count(self, obj):
#         return obj._media_count
#
#     @admin.display(
#         description="Children",
#         ordering="_children_count",
#     )
#     def children_count(self, obj):
#         return obj._children_count
#
#
# # ============================================================
# # AssignmentMedia
# # ============================================================
#
# @admin.register(AssignmentMedia)
# class AssignmentMediaAdmin(BaseAdmin):
#
#     list_display = (
#         "id",
#         "assignment",
#         "media",
#         "created_at",
#     )
#
#     search_fields = (
#         "assignment__title",
#         "assignment__line__title",
#         "media__text",
#         "media__file",
#     )
#
#     list_filter = (
#         "assignment__line",
#         "created_at",
#     )
#
#     raw_id_fields = (
#         "assignment",
#         "media",
#     )
#
#     list_select_related = (
#         "assignment",
#         "media",
#     )
#
#
# # ============================================================
# # AssignmentRecipient
# # ============================================================
#
# @admin.register(AssignmentRecipient)
# class AssignmentRecipientAdmin(BaseAdmin):
#
#     list_display = (
#         "id",
#         "assignment",
#         "member",
#         "user",
#         "line",
#         "submission_status",
#         "created_at",
#     )
#
#     search_fields = (
#         "assignment__title",
#         "member__user__username",
#         "member__user__email",
#         "member__user__first_name",
#         "member__user__last_name",
#         "member__line__title",
#     )
#
#     list_filter = (
#         "assignment__line",
#         "created_at",
#     )
#
#     raw_id_fields = (
#         "assignment",
#         "member",
#     )
#
#     list_select_related = (
#         "assignment",
#         "member",
#         "member__user",
#         "member__line",
#     )
#
#     @admin.display(description="User")
#     def user(self, obj):
#         return obj.member.user
#
#     @admin.display(description="Line")
#     def line(self, obj):
#         return obj.member.line
#
#     @admin.display(description="Submission")
#     def submission_status(self, obj):
#         exists = hasattr(obj, "submission")
#
#         if exists:
#             return format_html(
#                 '<span style="color:#198754;font-weight:600;">Submitted</span>'
#             )
#
#         return format_html(
#             '<span style="color:#dc3545;font-weight:600;">Pending</span>'
#         )
#
#
# # ============================================================
# # AssignmentSubmission
# # ============================================================
#
# @admin.register(AssignmentSubmission)
# class AssignmentSubmissionAdmin(BaseAdmin):
#
#     list_display = (
#         "id",
#         "assignment",
#         "member",
#         "user",
#         "media_count",
#         "created_at",
#     )
#
#     search_fields = (
#         "assignment_recipient__assignment__title",
#         "assignment_recipient__member__user__username",
#         "assignment_recipient__member__user__email",
#         "assignment_recipient__member__user__first_name",
#         "assignment_recipient__member__user__last_name",
#     )
#
#     list_filter = (
#         "assignment_recipient__assignment__line",
#         "created_at",
#     )
#
#     raw_id_fields = (
#         "assignment_recipient",
#     )
#
#     list_select_related = (
#         "assignment_recipient",
#         "assignment_recipient__assignment",
#         "assignment_recipient__member",
#         "assignment_recipient__member__user",
#     )
#
#     inlines = (
#         SubmissionMediaInline,
#     )
#
#     @admin.display(description="Assignment")
#     def assignment(self, obj):
#         return obj.assignment_recipient.assignment
#
#     @admin.display(description="Member")
#     def member(self, obj):
#         return obj.assignment_recipient.member
#
#     @admin.display(description="User")
#     def user(self, obj):
#         return obj.assignment_recipient.member.user
#
#     @admin.display(description="Media")
#     def media_count(self, obj):
#         return obj.media_items.count()
#
#
# # ============================================================
# # SubmissionMedia
# # ============================================================
#
# @admin.register(SubmissionMedia)
# class SubmissionMediaAdmin(BaseAdmin):
#
#     list_display = (
#         "id",
#         "submission",
#         "assignment",
#         "media",
#         "created_at",
#     )
#
#     search_fields = (
#         "submission__assignment_recipient__assignment__title",
#         "submission__assignment_recipient__member__user__username",
#         "submission__assignment_recipient__member__user__email",
#         "media__text",
#         "media__file",
#     )
#
#     list_filter = (
#         "submission__assignment_recipient__assignment__line",
#         "created_at",
#     )
#
#     raw_id_fields = (
#         "submission",
#         "media",
#     )
#
#     list_select_related = (
#         "submission",
#         "media",
#     )
#
#     @admin.display(description="Assignment")
#     def assignment(self, obj):
#         return obj.submission.assignment_recipient.assignment
#
#
# # ============================================================
# # Conversation
# # ============================================================
#
# @admin.register(Conversation)
# class ConversationAdmin(BaseAdmin):
#
#     list_display = (
#         "id",
#         "line",
#         "participants_count",
#         "messages_count",
#         "created_at",
#     )
#
#     search_fields = (
#         "line__title",
#         "participants__user__username",
#         "participants__user__email",
#         "participants__user__first_name",
#         "participants__user__last_name",
#     )
#
#     list_filter = (
#         "line",
#         "created_at",
#         "updated_at",
#     )
#
#     raw_id_fields = (
#         "line",
#     )
#
#     date_hierarchy = "created_at"
#
#     inlines = (
#         ConversationParticipantInline,
#         MessageInline,
#     )
#
#     list_select_related = (
#         "lines",
#     )
#
#     def get_queryset(self, request):
#         queryset = super().get_queryset(request)
#
#         return queryset.annotate(
#             _participants_count=Count(
#                 "participants",
#                 distinct=True,
#             ),
#             _messages_count=Count(
#                 "messages",
#                 distinct=True,
#             ),
#         )
#
#     @admin.display(
#         description="Participants",
#         ordering="_participants_count",
#     )
#     def participants_count(self, obj):
#         return obj._participants_count
#
#     @admin.display(
#         description="Messages",
#         ordering="_messages_count",
#     )
#     def messages_count(self, obj):
#         return obj._messages_count
#
#
# # ============================================================
# # ConversationParticipant
# # ============================================================
#
# @admin.register(ConversationParticipant)
# class ConversationParticipantAdmin(BaseAdmin):
#
#     list_display = (
#         "id",
#         "conversation",
#         "user",
#         "line",
#         "messages_count",
#         "created_at",
#     )
#
#     search_fields = (
#         "conversation__line__title",
#         "user__username",
#         "user__email",
#         "user__first_name",
#         "user__last_name",
#     )
#
#     list_filter = (
#         "conversation__line",
#         "created_at",
#     )
#
#     raw_id_fields = (
#         "conversation",
#         "user",
#     )
#
#     list_select_related = (
#         "conversation",
#         "conversation__line",
#         "user",
#     )
#
#     @admin.display(description="Line")
#     def line(self, obj):
#         return obj.conversation.line
#
#     @admin.display(description="Messages")
#     def messages_count(self, obj):
#         return obj.sent_messages.count()
#
#
# # ============================================================
# # Message
# # ============================================================
#
# class MessageAdminForm(forms.ModelForm):
#
#     class Meta:
#         model = Message
#         fields = "__all__"
#
#     def clean(self):
#         cleaned_data = super().clean()
#
#         conversation = cleaned_data.get("conversation")
#         sender = cleaned_data.get("sender")
#
#         if conversation and sender:
#             if sender.conversation_id != conversation.id:
#                 raise ValidationError(
#                     {
#                         "sender": (
#                             "The selected sender does not belong "
#                             "to the selected conversation."
#                         )
#                     }
#                 )
#
#         return cleaned_data
#
#
# @admin.register(Message)
# class MessageAdmin(BaseAdmin):
#
#     form = MessageAdminForm
#
#     list_display = (
#         "id",
#         "conversation",
#         "sender_user",
#         "message_content",
#         "has_media",
#         "created_at",
#     )
#
#     search_fields = (
#         "conversation__line__title",
#         "sender__user__username",
#         "sender__user__email",
#         "sender__user__first_name",
#         "sender__user__last_name",
#         "media__text",
#         "media__file",
#     )
#
#     list_filter = (
#         "conversation__line",
#         "created_at",
#         "updated_at",
#     )
#
#     raw_id_fields = (
#         "conversation",
#         "sender",
#         "media",
#     )
#
#     date_hierarchy = "created_at"
#
#     list_select_related = (
#         "conversation",
#         "conversation__line",
#         "sender",
#         "sender__user",
#         "media",
#     )
#
#     @admin.display(description="Sender")
#     def sender_user(self, obj):
#         return obj.sender.user
#
#     @admin.display(description="Content")
#     def message_content(self, obj):
#         if obj.media and obj.media.text:
#             text = obj.media.text
#
#             if len(text) > 80:
#                 return f"{text[:80]}..."
#
#             return text
#
#         if obj.media and obj.media.file:
#             return "📎 File"
#
#         return "—"
#
#     @admin.display(description="Media")
#     def has_media(self, obj):
#         if obj.media:
#             return format_html(
#                 '<span style="color:#198754;font-weight:600;">✓ Yes</span>'
#             )
#
#         return format_html(
#             '<span style="color:#6c757d;">—</span>'
#         )
#
#
# # ============================================================
# # ConsultationForm
# # ============================================================
#
# @admin.register(ConsultationForm)
# class ConsultationFormAdmin(BaseAdmin):
#
#     list_display = (
#         "id",
#         "title",
#         "line",
#         "file_link",
#         "created_at",
#     )
#
#     search_fields = (
#         "title",
#         "description",
#         "line__title",
#     )
#
#     list_filter = (
#         "line",
#         "created_at",
#         "updated_at",
#     )
#
#     raw_id_fields = (
#         "line",
#     )
#
#     date_hierarchy = "created_at"
#
#     list_select_related = (
#         "lines",
#     )
#
#     @admin.display(description="File")
#     def file_link(self, obj):
#         if not obj.file:
#             return "-"
#
#         try:
#             url = obj.file.url
#         except ValueError:
#             return "-"
#
#         return format_html(
#             '<a href="{}" target="_blank">Open file</a>',
#             url,
#         )
#
#
# # ============================================================
# # Appointment
# # ============================================================
#
# class AppointmentAdminForm(forms.ModelForm):
#
#     class Meta:
#         model = Appointment
#         fields = "__all__"
#
#     def clean(self):
#         cleaned_data = super().clean()
#
#         line = cleaned_data.get("lines")
#         member = cleaned_data.get("member")
#
#         if line and member:
#             if member.line_id != line.id:
#                 raise ValidationError(
#                     {
#                         "member": (
#                             "The selected member does not belong "
#                             "to the selected lines."
#                         )
#                     }
#                 )
#
#         return cleaned_data
#
#
# @admin.register(Appointment)
# class AppointmentAdmin(BaseAdmin):
#
#     form = AppointmentAdminForm
#
#     list_display = (
#         "id",
#         "line",
#         "member_user",
#         "staff",
#         "status_badge",
#         "appointment_time",
#         "created_at",
#     )
#
#     search_fields = (
#         "line__title",
#         "member__user__username",
#         "member__user__email",
#         "member__user__first_name",
#         "member__user__last_name",
#         "staff__user__username",
#         "staff__user__email",
#     )
#
#     list_filter = (
#         "line",
#         "status",
#         "appointment_time",
#         "created_at",
#     )
#
#     raw_id_fields = (
#         "line",
#         "member",
#         "staff",
#     )
#
#     date_hierarchy = "appointment_time"
#
#     list_select_related = (
#         "lines",
#         "member",
#         "member__user",
#         "staff",
#     )
#
#     @admin.display(description="Member")
#     def member_user(self, obj):
#         return obj.member.user
#
#     @admin.display(description="Status")
#     def status_badge(self, obj):
#         status = (obj.status or "").lower()
#
#         if status in {
#             "completed",
#             "approved",
#             "confirmed",
#             "done",
#         }:
#             color = "#198754"
#
#         elif status in {
#             "cancelled",
#             "canceled",
#             "rejected",
#             "failed",
#         }:
#             color = "#dc3545"
#
#         elif status in {
#             "pending",
#             "waiting",
#         }:
#             color = "#fd7e14"
#
#         else:
#             color = "#6c757d"
#
#         return format_html(
#             '<span style="'
#             'background:{};'
#             'color:white;'
#             'padding:4px 9px;'
#             'border-radius:12px;'
#             'font-size:11px;'
#             'font-weight:600;'
#             '">'
#             '{}'
#             '</span>',
#             color,
#             obj.status or "Unknown",
#         )
#
#
# # ============================================================
# # Feature
# # ============================================================
#
# @admin.register(Feature)
# class FeatureAdmin(BaseAdmin):
#
#     list_display = (
#         "id",
#         "title",
#         "line",
#         "parent",
#         "has_media",
#         "children_count",
#         "created_at",
#     )
#
#     search_fields = (
#         "title",
#         "text",
#         "line__title",
#     )
#
#     list_filter = (
#         "line",
#         "created_at",
#         "updated_at",
#     )
#
#     raw_id_fields = (
#         "line",
#         "parent",
#         "media",
#     )
#
#     date_hierarchy = "created_at"
#
#     list_select_related = (
#         "lines",
#         "parent",
#         "media",
#     )
#
#     def get_queryset(self, request):
#         queryset = super().get_queryset(request)
#
#         return queryset.annotate(
#             _children_count=Count(
#                 "children",
#                 distinct=True,
#             )
#         )
#
#     @admin.display(description="Media")
#     def has_media(self, obj):
#         if obj.media:
#             return format_html(
#                 '<span style="color:#198754;font-weight:600;">✓</span>'
#             )
#
#         return format_html(
#             '<span style="color:#6c757d;">—</span>'
#         )
#
#     @admin.display(
#         description="Children",
#         ordering="_children_count",
#     )
#     def children_count(self, obj):
#         return obj._children_count
#
#
# # ============================================================
# # Content
# # ============================================================
#
# @admin.register(Content)
# class ContentAdmin(BaseAdmin):
#
#     list_display = (
#         "id",
#         "title",
#         "line",
#         "member_user",
#         "parent",
#         "has_media",
#         "children_count",
#         "created_at",
#     )
#
#     search_fields = (
#         "title",
#         "text",
#         "line__title",
#         "member__user__username",
#         "member__user__email",
#         "member__user__first_name",
#         "member__user__last_name",
#     )
#
#     list_filter = (
#         "line",
#         "created_at",
#         "updated_at",
#     )
#
#     raw_id_fields = (
#         "line",
#         "parent",
#         "media",
#     )
#
#     date_hierarchy = "created_at"
#
#     list_select_related = (
#         "lines",
#         "parent",
#         "member",
#         "member__user",
#         "media",
#     )
#
#     def get_queryset(self, request):
#         queryset = super().get_queryset(request)
#
#         return queryset.annotate(
#             _children_count=Count(
#                 "children",
#                 distinct=True,
#             )
#         )
#
#     @admin.display(description="Member")
#     def member_user(self, obj):
#         if not obj.member:
#             return "-"
#
#         return obj.member.user
#
#     @admin.display(description="Media")
#     def has_media(self, obj):
#         if obj.media:
#             return format_html(
#                 '<span style="color:#198754;font-weight:600;">✓</span>'
#             )
#
#         return format_html(
#             '<span style="color:#6c757d;">—</span>'
#         )
#
#     @admin.display(
#         description="Children",
#         ordering="_children_count",
#     )
#     def children_count(self, obj):
#         return obj._children_count




















"""
admin.py — پنل مدیریت اپ operations

پیش‌نیاز: برای این‌که autocomplete_fields روی "user" و "staff" کار کند،
مدل‌های accounts.User و accounts.Staff باید در admin خودشان search_fields
تعریف کرده باشند (الزام خود Django برای AutocompleteSelect).
"""

from django.contrib import admin
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from django.urls import reverse

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
    ContentRecipient,
)


# =============================================================================
# Helpers
# =============================================================================

READONLY_BASE = ("id", "created_at", "updated_at")


def short_uuid(obj):
    """نمایش کوتاه‌شده‌ی UUID برای خوانایی بهتر در ستون‌های لیست."""
    return str(obj.id)[:8]


short_uuid.short_description = "شناسه"


def tree_depth(obj, max_depth=10):
    """
    عمق یک آبجکت خودارجاع (self-referential) را با دنبال کردن زنجیره‌ی
    parent محاسبه می‌کند. سقف max_depth صرفاً محافظ در برابر داده‌ی
    خراب (حلقه‌ی parent) است، نه یک محدودیت منطقی واقعی.
    """
    depth = 0
    current = obj.parent
    while current is not None and depth < max_depth:
        depth += 1
        current = current.parent
    return depth


def indented_title(obj, field="title"):
    """عنوان را با تورفتگی بصری متناسب با عمقش در درخت parent/child نمایش می‌دهد."""
    depth = tree_depth(obj)
    prefix = "—" * depth + " " if depth else ""
    value = getattr(obj, field, "") or ""
    return format_html("<span style='white-space:pre'>{}</span>{}", prefix, value)


def file_preview(file_field, label="فایل"):
    """
    پیش‌نمایش فایل: اگر تصویر باشد <img> کوچک، در غیر این صورت
    لینک دانلود با آیکون نوع فایل.
    """
    if not file_field:
        return "—"
    name = file_field.name.lower()
    image_exts = (".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg")
    if name.endswith(image_exts):
        return format_html(
            '<a href="{0}" target="_blank">'
            '<img src="{0}" style="height:48px;width:48px;object-fit:cover;'
            'border-radius:6px;border:1px solid #ddd;" /></a>',
            file_field.url,
        )
    return format_html(
        '<a href="{}" target="_blank">📎 دانلود {}</a>',
        file_field.url,
        label,
    )


STATUS_COLORS = {
    "pending": "#f59e0b",
    "confirmed": "#3b82f6",
    "completed": "#10b981",
    "cancelled": "#ef4444",
    "canceled": "#ef4444",
    "rejected": "#ef4444",
}


def status_badge(value):
    """رنگ‌بندی وضعیت‌های شناخته‌شده؛ مقادیر ناشناس خاکستری خنثی نمایش داده می‌شوند."""
    if not value:
        return "—"
    color = STATUS_COLORS.get(str(value).strip().lower(), "#64748b")
    return format_html(
        '<span style="background:{}1a;color:{};padding:2px 10px;'
        'border-radius:999px;font-size:11px;font-weight:600;">{}</span>',
        color,
        color,
        value,
    )


# =============================================================================
# InviteRule
# =============================================================================

@admin.register(InviteRule)
class InviteRuleAdmin(admin.ModelAdmin):
    list_display = (short_uuid, "created_at", "is_active")
    list_filter = ("is_active",)
    readonly_fields = READONLY_BASE
    ordering = ("-created_at",)


# =============================================================================
# Line (ساختار درختی بخش‌ها)
# =============================================================================

class LineMemberInline(admin.TabularInline):
    model = LineMember
    extra = 0
    autocomplete_fields = ("user",)
    fields = ("user", "is_active", "created_at")
    readonly_fields = ("created_at",)
    show_change_link = True


class StaffLineInline(admin.TabularInline):
    model = StaffLine
    extra = 0
    autocomplete_fields = ("staff",)
    fields = ("staff", "is_active", "created_at")
    readonly_fields = ("created_at",)
    show_change_link = True


@admin.register(Line)
class LineAdmin(admin.ModelAdmin):
    list_display = ("tree_title", "parent", "member_count", "staff_count", "is_active", "created_at")
    list_display_links = ("tree_title",)
    list_editable = ("is_active",)
    list_filter = ("is_active", "parent")
    search_fields = ("title", "descriptions")
    autocomplete_fields = ("parent",)
    readonly_fields = READONLY_BASE
    ordering = ("title",)
    list_select_related = ("parent",)
    inlines = (LineMemberInline, StaffLineInline)

    @admin.display(description="عنوان بخش")
    def tree_title(self, obj):
        return indented_title(obj, "title")

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .select_related("parent")
            .prefetch_related("members", "staff_memberships")
        )

    @admin.display(description="تعداد اعضا")
    def member_count(self, obj):
        return obj.members.count()

    @admin.display(description="تعداد کارمندان")
    def staff_count(self, obj):
        return obj.staff_memberships.count()


# =============================================================================
# LineMember / StaffLine (به‌صورت مستقل هم قابل جست‌وجو باشند)
# =============================================================================

@admin.register(LineMember)
class LineMemberAdmin(admin.ModelAdmin):
    list_display = (short_uuid, "user", "line", "is_active", "created_at")
    list_filter = ("is_active", "line")
    search_fields = (
        "user__username",
        "user__first_name",
        "user__last_name",
        "line__title",
    )
    autocomplete_fields = ("user", "line")
    readonly_fields = READONLY_BASE
    list_select_related = ("user", "line")
    ordering = ("-created_at",)


@admin.register(StaffLine)
class StaffLineAdmin(admin.ModelAdmin):
    list_display = (short_uuid, "staff", "line", "is_active", "created_at")
    list_filter = ("is_active", "line")
    search_fields = (
        "staff__user__username",
        "staff__user__first_name",
        "staff__user__last_name",
        "staff__employee_code",
        "line__title",
    )
    autocomplete_fields = ("staff", "line")
    readonly_fields = READONLY_BASE
    list_select_related = ("staff", "staff__user", "line")
    ordering = ("-created_at",)


# =============================================================================
# Media
# =============================================================================

@admin.register(Media)
class MediaAdmin(admin.ModelAdmin):
    list_display = (short_uuid, "preview_thumb", "content", "short_text", "created_at", "is_active")
    list_filter = ("is_active",)
    search_fields = ("text",)
    autocomplete_fields = ("content",)
    readonly_fields = READONLY_BASE + ("preview_large",)
    fields = ("content", "text", "file", "preview_large", "is_active") + READONLY_BASE
    ordering = ("-created_at",)

    @admin.display(description="پیش‌نمایش")
    def preview_thumb(self, obj):
        return file_preview(obj.file, "فایل")

    @admin.display(description="پیش‌نمایش کامل")
    def preview_large(self, obj):
        return file_preview(obj.file, "فایل")

    @admin.display(description="متن")
    def short_text(self, obj):
        text = obj.text or ""
        return text[:60] + ("…" if len(text) > 60 else "")


# =============================================================================
# Assignment (تکلیف/تمرین) با درخت parent/child + رسانه‌ها + گیرندگان
# =============================================================================

class AssignmentMediaInline(admin.TabularInline):
    model = AssignmentMedia
    extra = 0
    autocomplete_fields = ("media",)


class AssignmentRecipientInline(admin.TabularInline):
    model = AssignmentRecipient
    extra = 0
    autocomplete_fields = ("member",)
    show_change_link = True


@admin.register(Assignment)
class AssignmentAdmin(admin.ModelAdmin):
    list_display = ("tree_title", "line", "parent", "recipient_count", "media_count", "created_at")
    list_display_links = ("tree_title",)
    list_filter = ("line",)
    search_fields = ("title", "description", "line__title")
    autocomplete_fields = ("line", "parent")
    readonly_fields = READONLY_BASE
    list_select_related = ("line", "parent")
    ordering = ("-created_at",)
    inlines = (AssignmentMediaInline, AssignmentRecipientInline)

    @admin.display(description="عنوان تکلیف")
    def tree_title(self, obj):
        return indented_title(obj, "title")

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .select_related("line", "parent")
            .prefetch_related("recipients", "media_items")
        )

    @admin.display(description="تعداد گیرندگان")
    def recipient_count(self, obj):
        return obj.recipients.count()

    @admin.display(description="تعداد رسانه")
    def media_count(self, obj):
        return obj.media_items.count()


@admin.register(AssignmentMedia)
class AssignmentMediaAdmin(admin.ModelAdmin):
    list_display = (short_uuid, "assignment", "media", "created_at")
    search_fields = ("assignment__title",)
    autocomplete_fields = ("assignment", "media")
    readonly_fields = READONLY_BASE
    list_select_related = ("assignment", "media")


@admin.register(AssignmentRecipient)
class AssignmentRecipientAdmin(admin.ModelAdmin):
    list_display = (short_uuid, "assignment", "member", "created_at")
    search_fields = (
        "assignment__title",
        "member__user__username",
        "member__user__first_name",
        "member__user__last_name",
    )
    autocomplete_fields = ("assignment", "member")
    readonly_fields = READONLY_BASE
    list_select_related = ("assignment", "member", "member__user")


# =============================================================================
# AssignmentSubmission / SubmissionMedia
# =============================================================================

class SubmissionMediaInline(admin.TabularInline):
    model = SubmissionMedia
    extra = 0
    autocomplete_fields = ("media",)


@admin.register(AssignmentSubmission)
class AssignmentSubmissionAdmin(admin.ModelAdmin):
    list_display = (short_uuid, "assignment_recipient", "media_count", "created_at")
    search_fields = (
        "assignment_recipient__assignment__title",
        "assignment_recipient__member__user__username",
    )
    autocomplete_fields = ("assignment_recipient",)
    readonly_fields = READONLY_BASE
    list_select_related = (
        "assignment_recipient",
        "assignment_recipient__assignment",
        "assignment_recipient__member",
    )
    inlines = (SubmissionMediaInline,)

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related("media_items")

    @admin.display(description="تعداد رسانه")
    def media_count(self, obj):
        return obj.media_items.count()


@admin.register(SubmissionMedia)
class SubmissionMediaAdmin(admin.ModelAdmin):
    list_display = (short_uuid, "submission", "media", "created_at")
    autocomplete_fields = ("submission", "media")
    readonly_fields = READONLY_BASE
    list_select_related = ("submission", "media")


# =============================================================================
# Conversation / ConversationParticipant / Message
# =============================================================================

class ConversationParticipantInline(admin.TabularInline):
    model = ConversationParticipant
    extra = 0
    autocomplete_fields = ("user",)


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = (short_uuid, "line", "participant_count", "message_count", "created_at")
    list_filter = ("line",)
    search_fields = ("line__title",)
    autocomplete_fields = ("line",)
    readonly_fields = READONLY_BASE
    list_select_related = ("line",)
    ordering = ("-created_at",)
    inlines = (ConversationParticipantInline,)

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .select_related("line")
            .prefetch_related("participants", "messages")
        )

    @admin.display(description="تعداد شرکت‌کنندگان")
    def participant_count(self, obj):
        return obj.participants.count()

    @admin.display(description="تعداد پیام‌ها")
    def message_count(self, obj):
        return obj.messages.count()


@admin.register(ConversationParticipant)
class ConversationParticipantAdmin(admin.ModelAdmin):
    list_display = (short_uuid, "conversation", "user", "created_at")
    search_fields = (
        "user__username",
        "user__first_name",
        "user__last_name",
    )
    autocomplete_fields = ("conversation", "user")
    readonly_fields = READONLY_BASE
    list_select_related = ("conversation", "user")


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = (short_uuid, "conversation", "sender", "media_preview", "created_at")
    list_filter = ("conversation__line",)
    search_fields = (
        "sender__user__username",
        "conversation__line__title",
    )
    autocomplete_fields = ("conversation", "sender", "media")
    readonly_fields = READONLY_BASE
    list_select_related = ("conversation", "sender", "sender__user", "media")
    ordering = ("-created_at",)
    date_hierarchy = "created_at"

    @admin.display(description="رسانه")
    def media_preview(self, obj):
        if not obj.media or not obj.media.file:
            return "—"
        return file_preview(obj.media.file, "رسانه")


# =============================================================================
# ConsultationForm
# =============================================================================

@admin.register(ConsultationForm)
class ConsultationFormAdmin(admin.ModelAdmin):
    list_display = (short_uuid, "title", "line", "file_link", "created_at")
    search_fields = ("title", "line__title")
    autocomplete_fields = ("line",)
    readonly_fields = READONLY_BASE + ("file_link",)
    list_select_related = ("line",)
    ordering = ("-created_at",)

    @admin.display(description="فایل")
    def file_link(self, obj):
        return file_preview(obj.file, "فرم")


# =============================================================================
# Appointment
# =============================================================================

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = (
        short_uuid,
        "line",
        "member",
        "staff",
        "status_display",
        "appointment_time",
        "created_at",
    )
    list_filter = ("status", "line")
    search_fields = (
        "member__user__username",
        "member__user__first_name",
        "member__user__last_name",
        "staff__user__username",
        "line__title",
    )
    autocomplete_fields = ("line", "member", "staff")
    readonly_fields = READONLY_BASE
    list_select_related = ("line", "member", "member__user", "staff", "staff__user")
    date_hierarchy = "appointment_time"
    ordering = ("-appointment_time",)

    @admin.display(description="وضعیت")
    def status_display(self, obj):
        return status_badge(obj.status)


# =============================================================================
# Feature (ساختار درختی ویژگی‌ها)
# =============================================================================

@admin.register(Feature)
class FeatureAdmin(admin.ModelAdmin):
    list_display = ("tree_title", "line", "parent", "has_media", "created_at", "is_active")
    list_display_links = ("tree_title",)
    list_editable = ("is_active",)
    list_filter = ("is_active", "line")
    search_fields = ("title", "text", "line__title")
    autocomplete_fields = ("line", "parent", "media")
    readonly_fields = READONLY_BASE
    list_select_related = ("line", "parent", "media")
    ordering = ("line", "title")

    @admin.display(description="عنوان")
    def tree_title(self, obj):
        return indented_title(obj, "title")

    @admin.display(description="رسانه", boolean=True)
    def has_media(self, obj):
        return bool(obj.media_id)


# =============================================================================
# Content (ساختار درختی محتوا) + گیرندگان
# =============================================================================

class ContentRecipientInline(admin.TabularInline):
    model = ContentRecipient
    extra = 0
    autocomplete_fields = ("member",)


@admin.register(Content)
class ContentAdmin(admin.ModelAdmin):
    list_display = ("tree_title", "line", "parent", "recipient_count", "created_at", "is_active")
    list_display_links = ("tree_title",)
    list_editable = ("is_active",)
    list_filter = ("is_active", "line")
    search_fields = ("title", "text", "line__title")
    autocomplete_fields = ("line", "parent")
    readonly_fields = READONLY_BASE
    list_select_related = ("line", "parent")
    ordering = ("line", "title")
    inlines = (ContentRecipientInline,)

    @admin.display(description="عنوان")
    def tree_title(self, obj):
        return indented_title(obj, "title")

    def get_queryset(self, request):
        return (
            super()
            .get_queryset(request)
            .select_related("line", "parent")
            .prefetch_related("recipients")
        )

    @admin.display(description="تعداد گیرندگان")
    def recipient_count(self, obj):
        return obj.recipients.count()


@admin.register(ContentRecipient)
class ContentRecipientAdmin(admin.ModelAdmin):
    list_display = (short_uuid, "content", "member", "created_at")
    search_fields = (
        "content__title",
        "member__user__username",
        "member__user__first_name",
        "member__user__last_name",
    )
    autocomplete_fields = ("content", "member")
    readonly_fields = READONLY_BASE
    list_select_related = ("content", "member", "member__user")