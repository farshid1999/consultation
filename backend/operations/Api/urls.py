from django.urls import include, path

from .views import *

# =========================
# Line URLs
# =========================

line_urls = [
    path(
        "",
        LineListAPIView.as_view(),
        name="lines-list",
    ),
    path(
        "my/",
        MyLineListAPIView.as_view(),
        name="my-lines-list",
    ),
    path(
        "<str:pk>/",
        LineDetailAPIView.as_view(),
        name="lines-detail",
    ),
    path(
        "<str:line_id>/members/",
        LineMemberListView.as_view(),
        name="lines-members",
    ),
    path(
        "<str:line_id>/members/add/",
        LineAddMembersView.as_view(),
        name="lines-add-members",
    ),
    path(
        "<str:line_id>/members/remove/",
        LineRemoveMembersView.as_view(),
        name="lines-remove-members",
    ),
    path(
        "<str:line_id>/staff/",
        LineStaffListView.as_view(),
        name="lines-staff",
    ),
    path(
        "<str:line_id>/staff/add/",
        LineAddStaffView.as_view(),
        name="lines-add-staff",
    ),
    path(
        "<str:line_id>/staff/remove/",
        LineRemoveStaffView.as_view(),
        name="lines-remove-staff",
    ),
]

# =========================
# Assignment URLs
# =========================

assignment_urls = [
    # Create / Update
    path(
        "create/",
        AssignmentCreateAPIView.as_view(),
        name="assignment-create",
    ),
    path(
        "<int:pk>/update/",
        AssignmentUpdateAPIView.as_view(),
        name="assignment-update",
    ),
    # Admin - All Assignments
    path(
        "admin/",
        AllAssignmentListAPIView.as_view(),
        name="admin-assignment-list",
    ),
    path(
        "admin/<str:pk>/",
        AdminAssignmentDetailAPIView.as_view(),
        name="admin-assignment-detail",
    ),
]

# =========================
# Staff Assignment URLs
# =========================

# operations/Api/urls.py (یا هر جایی که urls.py شماست)

# =========================
# Staff Assignment URLs
# =========================
staff_assignment_urls = [
    path("lines/<str:line_id>/", StaffAssignmentListAPIView.as_view(), name="staff-assignment-list"),
    path("lines/<str:line_id>/<str:assignment_id>/", StaffAssignmentDetailAPIView.as_view(), name="staff-assignment-detail"), # ✅ تغییر به str
    path("lines/<str:line_id>/<str:assignment_id>/submissions/", StaffAssignmentSubmissionListAPIView.as_view(), name="staff-assignment-submission-list"),
    path("lines/<str:line_id>/<str:assignment_id>/submissions/<str:submission_id>/", StaffAssignmentSubmissionDetailAPIView.as_view(), name="staff-assignment-submission-detail"), # ✅ تغییر به str
]

# =========================
# Member Assignment URLs
# =========================
member_assignment_urls = [
    path("lines/<str:line_id>/", MemberAssignmentListAPIView.as_view(), name="member-assignment-list"),
    path("lines/<str:line_id>/<str:assignment_id>/", MemberAssignmentDetailAPIView.as_view(), name="member-assignment-detail"), # ✅ تغییر به str
    path("<str:assignment_id>/submit/", AssignmentSubmissionCreateAPIView.as_view(), name="assignment-submission-create"), # ✅ تغییر به str
    path("<str:assignment_id>/submission/", AssignmentSubmissionUpdateAPIView.as_view(), name="assignment-submission-update"), # ✅ تغییر به str
    path("lines/<str:line_id>/<str:assignment_id>/submissions/", MemberAssignmentSubmissionListAPIView.as_view(), name="member-assignment-submission-list"), # ✅ تغییر به str
    path("lines/<str:line_id>/<str:assignment_id>/submissions/<str:submission_id>/", MemberAssignmentSubmissionDetailAPIView.as_view(), name="member-assignment-submission-detail"), # ✅ تغییر به str
]
# =========================
# Admin Assignment Submission URLs
# =========================
admin_assignment_submission_urls = [
    path("", AllAssignmentSubmissionListAPIView.as_view(), name="admin-assignment-submission-list"),
]

# =========================
# Conversation & Message URLs
# =========================
conversation_urls = [
    path("", MemberConversationCreateAPIView.as_view(), name="member-conversation-create"),
    
    path("<str:conversation_id>/messages/", MessageCreateAPIView.as_view(), name="message-create"),
]

staff_conversation_urls = [
    path("", StaffConversationListAPIView.as_view(), name="staff-conversation-list"),
    path("create/", StaffConversationCreateAPIView.as_view(), name="staff-conversation-create"),
    path("<str:pk>/", StaffConversationDetailAPIView.as_view(), name="staff-conversation-detail"),
    path("<str:pk>/join/", ConversationJoinAPIView.as_view(), name="staff-conversation-join"),
]

member_conversation_urls = [
    path("<str:pk>/", MemberConversationDetailAPIView.as_view(), name="member-conversation-detail"),
]


# =========================
# Content URLs
# =========================

content_urls = [
    # Create
    path(
        "create/",
        ContentCreateAPIView.as_view(),
        name="content-create",
    ),
    # Update
    path(
        "<str:pk>/update/",
        ContentUpdateAPIView.as_view(),
        name="content-update",
    ),
]

# =========================
# Staff Content URLs
# =========================

staff_content_urls = [
    path(
        "",
        StaffContentListAPIView.as_view(),
        name="staff-content-list",
    ),
    path(
        "<str:pk>/",
        StaffContentDetailAPIView.as_view(),
        name="staff-content-detail",
    ),
]

# =========================
# Member Content URLs
# =========================

member_content_urls = [
    path(
        "",
        MemberContentListAPIView.as_view(),
        name="member-content-list",
    ),
    path(
        "<str:pk>/",
        MemberContentDetailAPIView.as_view(),
        name="member-content-detail",
    ),
]

# =========================
# Admin Content URLs
# =========================

admin_content_urls = [
    path(
        "",
        AdminContentListAPIView.as_view(),
        name="admin-content-list",
    ),
]

consultation_form_urls = [
    path("<str:line_id>/", ConsultationFormDetailView.as_view(), ),
    path("<str:consultation_id>/submit/", SubmitConsultationFormDetailView.as_view(), ),
    path(
        "lines/<str:line_id>/create-update/",
        ConsultationFormAPIView.as_view(),
        name="consultation-form",
    ),
    path(
        "<str:consultation_id>/members/<str:member_id>/submit/",
        SubmitConsultationFormAPIView.as_view(),
        name="member-submit-consultation-form",
    ),
    path(
        "consultation-forms/<str:consultation_id>/submissions/",
        SubmitConsultationFormListAPIView.as_view(),
        name="consultation-form-submissions",
    ),
]

# =========================
# Main URL List
# =========================

urlpatterns = [
    # -------------------------
    # Lines
    # -------------------------
    path(
        "lines/",
        include(line_urls),
    ),
    # -------------------------
    # Assignments
    # -------------------------
    path(
        "assignments/",
        include(assignment_urls),
    ),
    path(
        "staff/assignments/",
        include(staff_assignment_urls),
    ),
    path(
        "member/assignments/",
        include(member_assignment_urls),
    ),
    path(
        "admin/assignment-submissions/",
        include(admin_assignment_submission_urls),
    ),
    # -------------------------
    # Conversations
    # -------------------------
    path(
        "conversations/",
        include(conversation_urls),
    ),
    path(
        "staff/conversations/",
        include(staff_conversation_urls),
    ),
    path(
        "member/conversations/",
        include(member_conversation_urls),
    ),
    # -------------------------
    # Contents
    # -------------------------
    path(
        "contents/",
        include(content_urls),
    ),
    path(
        "staff/contents/",
        include(staff_content_urls),
    ),
    path(
        "member/contents/",
        include(member_content_urls),
    ),
    path(
        "admin/contents/",
        include(admin_content_urls),
    ),

    path("cosultation/", include(consultation_form_urls))
]
