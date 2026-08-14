from django.urls import path, include

from .views import *


# =========================
# Line URLs
# =========================

line_urls = [

    path(
        "",
        LineListAPIView.as_view(),
        name="line-list",
    ),

    path(
        "<int:pk>/",
        LineDetailAPIView.as_view(),
        name="line-detail",
    ),

    path(
        "my/",
        MyLineListAPIView.as_view(),
        name="my-line-list",
    ),

    path(
        "<int:line_id>/members/",
        LineMemberListView.as_view(),
        name="line-members",
    ),

    path(
        "<int:line_id>/members/add/",
        LineAddMembersView.as_view(),
        name="line-add-members",
    ),

    path(
        "<int:line_id>/members/remove/",
        LineRemoveMembersView.as_view(),
        name="line-remove-members",
    ),

    path(
        "<int:line_id>/staff/",
        LineStaffListView.as_view(),
        name="line-staff",
    ),

    path(
        "<int:line_id>/staff/add/",
        LineAddStaffView.as_view(),
        name="line-add-staff",
    ),

    path(
        "<int:line_id>/staff/remove/",
        LineRemoveStaffView.as_view(),
        name="line-remove-staff",
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

]


# =========================
# Staff Assignment URLs
# =========================

staff_assignment_urls = [

    path(
        "lines/<int:line_id>/",
        StaffAssignmentListAPIView.as_view(),
        name="staff-assignment-list",
    ),

    path(
        "lines/<int:line_id>/<int:assignment_id>/",
        StaffAssignmentDetailAPIView.as_view(),
        name="staff-assignment-detail",
    ),

    path(
        "lines/<int:line_id>/<int:assignment_id>/submissions/",
        StaffAssignmentSubmissionListAPIView.as_view(),
        name="staff-assignment-submission-list",
    ),

    path(
        "lines/<int:line_id>/<int:assignment_id>/submissions/<int:submission_id>/",
        StaffAssignmentSubmissionDetailAPIView.as_view(),
        name="staff-assignment-submission-detail",
    ),

]


# =========================
# Member Assignment URLs
# =========================

member_assignment_urls = [

    path(
        "lines/<int:line_id>/",
        MemberAssignmentListAPIView.as_view(),
        name="member-assignment-list",
    ),

    path(
        "lines/<int:line_id>/<int:assignment_id>/",
        MemberAssignmentDetailAPIView.as_view(),
        name="member-assignment-detail",
    ),

    path(
        "<int:assignment_id>/submit/",
        AssignmentSubmissionCreateAPIView.as_view(),
        name="assignment-submission-create",
    ),

    path(
        "<int:assignment_id>/submission/",
        AssignmentSubmissionUpdateAPIView.as_view(),
        name="assignment-submission-update",
    ),

    path(
        "lines/<int:line_id>/<int:assignment_id>/submissions/",
        MemberAssignmentSubmissionListAPIView.as_view(),
        name="member-assignment-submission-list",
    ),

    path(
        "lines/<int:line_id>/<int:assignment_id>/submissions/<int:submission_id>/",
        MemberAssignmentSubmissionDetailAPIView.as_view(),
        name="member-assignment-submission-detail",
    ),

]


# =========================
# Admin Assignment Submission URLs
# =========================

admin_assignment_submission_urls = [

    path(
        "",
        AllAssignmentSubmissionListAPIView.as_view(),
        name="admin-assignment-submission-list",
    ),

]


# =========================
# Conversation URLs
# =========================

conversation_urls = [

    # Member creates / gets conversation with line
    path(
        "",
        MemberConversationCreateAPIView.as_view(),
        name="member-conversation-create",
    ),

]


# =========================
# Staff Conversation URLs
# =========================

staff_conversation_urls = [

    path(
        "",
        StaffConversationListAPIView.as_view(),
        name="staff-conversation-list",
    ),

    path(
        "create/",
        StaffConversationCreateAPIView.as_view(),
        name="staff-conversation-create",
    ),

    path(
        "<int:pk>/",
        StaffConversationDetailAPIView.as_view(),
        name="staff-conversation-detail",
    ),

    path(
        "<int:pk>/join/",
        ConversationJoinAPIView.as_view(),
        name="staff-conversation-join",
    ),

]


# =========================
# Member Conversation URLs
# =========================

member_conversation_urls = [

    path(
        "<int:pk>/",
        MemberConversationDetailAPIView.as_view(),
        name="member-conversation-detail",
    ),

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
        "<int:pk>/",
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
        "<int:pk>/",
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

]