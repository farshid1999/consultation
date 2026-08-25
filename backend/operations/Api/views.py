from django.core.cache import cache
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

from rest_framework import generics, status
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from core.permissions import IsAdminOrSuperUser, IsStaff
from operations.models import Line, LineMember, StaffLine, Assignment, AssignmentRecipient, AssignmentSubmission, \
    Conversation, Content
from .serializers import LineListSerializer, LineDetailSerializer, AddLineMembersSerializer, \
    RemoveLineMembersSerializer, AddLineStaffSerializer, RemoveLineStaffSerializer, LineMemberSerializer, \
    StaffLineSerializer, AssignmentCreateSerializer, AssignmentUpdateSerializer, AllAssignmentListSerializer, \
    AssignmentListSerializer, AssignmentDetailSerializer, AssignmentSubmissionCreateSerializer, \
    AssignmentSubmissionUpdateSerializer, AssignmentSubmissionListSerializer, AssignmentSubmissionDetailSerializer, \
    AllAssignmentSubmissionListSerializer, MemberConversationCreateSerializer, StaffConversationCreateSerializer, \
    ConversationListSerializer, ConversationDetailSerializer, ConversationJoinSerializer, MessageCreateSerializer, \
    MessageSerializer, ContentCreateSerializer, ContentUpdateSerializer, ContentDetailSerializer, ContentListSerializer, \
    ContentLineListSerializer


class LineListAPIView(generics.ListAPIView):
    serializer_class = LineListSerializer
    pagination_class = None
    permission_classes = [AllowAny]

    filter_backends = (
        SearchFilter,
    )

    search_fields = (
        "title",
    )

    def list(self, request, *args, **kwargs):
        search = request.query_params.get("search", "").strip()

        cache_key = f"lines:list:{search}"

        cached_data = cache.get(cache_key)

        if cached_data is not None:
            return Response(cached_data)

        queryset = self.filter_queryset(
            self.get_queryset()
        )

        serializer = self.get_serializer(
            queryset,
            many=True,
        )

        data = serializer.data

        cache.set(
            cache_key,
            data,
            timeout=60 * 5,
        )

        return Response(data)

    def get_queryset(self):
        return Line.objects.select_related(
            "parent",
        ).prefetch_related(
            "children",
        )


class LineDetailAPIView(generics.RetrieveAPIView):
    serializer_class = LineDetailSerializer
    permission_classes = [AllowAny]


    def get_queryset(self):
        return Line.objects.select_related(
            "parent",
        ).prefetch_related(
            "features__media",
            "children__features__media",
        )

    def retrieve(self, request, *args, **kwargs):
        line_id = kwargs["pk"]

        cache_key = f"lines:detail:{line_id}"

        cached_data = cache.get(cache_key)

        if cached_data is not None:
            return Response(cached_data)

        instance = self.get_object()

        serializer = self.get_serializer(instance)

        data = serializer.data

        cache.set(
            cache_key,
            data,
            timeout=60 * 5,
        )

        return Response(data)


class MyLineListAPIView(generics.ListAPIView):
    serializer_class = LineListSerializer
    permission_classes = [AllowAny]

    filter_backends = (
        SearchFilter,
    )

    search_fields = (
        "title",
    )

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser or user.user_roles.filter(role__name="admin").exists():
            return (
                Line.objects
                .all()
                .select_related("parent")
                .prefetch_related("children")
                .distinct()
            )

        return (
            Line.objects
            .filter(
                Q(members__user=user)
                | Q(staff_memberships__staff__user=user)
            )
            .select_related(
                "parent",
            )
            .prefetch_related(
                "children",
            )
            .distinct()
        )

    def list(self, request, *args, **kwargs):
        search = request.query_params.get("search", "").strip()

        cache_key = f"user:{request.user.id}:my-lines:{search}"

        cached_data = cache.get(cache_key)

        if cached_data is not None:
            return Response(cached_data)

        queryset = self.filter_queryset(
            self.get_queryset()
        )

        serializer = self.get_serializer(
            queryset,
            many=True,
        )

        data = serializer.data

        cache.set(
            cache_key,
            data,
            timeout=60 * 5,
        )

        return Response(data)


class LineAddMembersView(GenericAPIView):
    serializer_class = AddLineMembersSerializer
    permission_classes = [IsAdminOrSuperUser | IsStaff]

    def post(self, request, line_id):
        line = get_object_or_404(Line, id=line_id)

        serializer = self.get_serializer(
            data=request.data,
            context={
                "request": request,
                "lines": line,
            },
        )

        serializer.is_valid(raise_exception=True)
        memberships = serializer.save()

        return Response(
            {
                "detail": "Users added to lines successfully.",
                "count": len(memberships),
            },
            status=status.HTTP_201_CREATED,
        )


class LineRemoveMembersView(GenericAPIView):
    serializer_class = RemoveLineMembersSerializer
    permission_classes = [IsAdminOrSuperUser | IsStaff]

    def post(self, request, line_id):
        line = get_object_or_404(Line, id=line_id)

        serializer = self.get_serializer(
            data=request.data,
            context={
                "request": request,
                "lines": line,
            },
        )

        serializer.is_valid(raise_exception=True)

        user_ids = [
            user.id
            for user in serializer.validated_data["user_ids"]
        ]

        deleted_count, _ = LineMember.objects.filter(
            line=line,
            user_id__in=user_ids,
        ).delete()

        return Response(
            {
                "detail": "Users removed from lines successfully.",
                "count": deleted_count,
            },
            status=status.HTTP_200_OK,
        )



class LineAddStaffView(GenericAPIView):
    serializer_class = AddLineStaffSerializer
    permission_classes = [IsAdminOrSuperUser]

    def post(self, request, line_id):
        line = get_object_or_404(Line, id=line_id)

        serializer = self.get_serializer(
            data=request.data,
            context={
                "request": request,
                "lines": line,
            },
        )

        serializer.is_valid(raise_exception=True)
        staff_lines = serializer.save()

        return Response(
            {
                "detail": "Staff added to lines successfully.",
                "count": len(staff_lines),
            },
            status=status.HTTP_201_CREATED,
        )

class LineRemoveStaffView(GenericAPIView):
    serializer_class = RemoveLineStaffSerializer
    permission_classes = [IsAdminOrSuperUser]

    def post(self, request, line_id):
        line = get_object_or_404(Line, id=line_id)

        serializer = self.get_serializer(
            data=request.data,
            context={
                "request": request,
                "lines": line,
            },
        )

        serializer.is_valid(raise_exception=True)

        staff_ids = [
            staff.id
            for staff in serializer.validated_data["staff_ids"]
        ]

        deleted_count, _ = StaffLine.objects.filter(
            line=line,
            staff_id__in=staff_ids,
        ).delete()

        return Response(
            {
                "detail": "Staff removed from lines successfully.",
                "count": deleted_count,
            },
            status=status.HTTP_200_OK,
        )


@method_decorator(cache_page(60 * 5), name="dispatch")
class LineMemberListView(generics.ListAPIView):
    serializer_class = LineMemberSerializer
    permission_classes = [IsStaff | IsAdminOrSuperUser]

    filter_backends = (
        SearchFilter,
        OrderingFilter,
    )

    search_fields = (
        "user__username",
        "user__first_name",
        "user__last_name",
        "user__phone_number",
        "user__email",
    )

    ordering_fields = (
        "id",
        "user__username",
        "user__first_name",
        "user__last_name",
        "user__phone_number",
    )

    ordering = ("id",)

    def get_queryset(self):
        return (
            LineMember.objects
            .filter(line_id=self.kwargs["line_id"])
            .select_related(
                "user",
                "user__address",
                "user__club",
                "user__club__address",
            )
            .prefetch_related(
                "user__informations",
                "user__informations__children",
            )
        )



@method_decorator(cache_page(60 * 5), name="dispatch")
class LineStaffListView(generics.ListAPIView):
    serializer_class = StaffLineSerializer
    permission_classes = [IsAdminOrSuperUser]

    filter_backends = (
        SearchFilter,
        OrderingFilter,
    )

    search_fields = (
        "staff__user__username",
        "staff__user__first_name",
        "staff__user__last_name",
        "staff__user__phone_number",
        "staff__user__email",
    )

    ordering_fields = (
        "id",
        "staff__user__username",
        "staff__user__first_name",
        "staff__user__last_name",
        "staff__user__phone_number",
    )

    ordering = ("id",)

    def get_queryset(self):
        return (
            StaffLine.objects
            .filter(line_id=self.kwargs["line_id"])
            .select_related(
                "staff",
                "staff__user",
                "staff__user__address",
                "staff__user__club",
                "staff__user__club__address",
            )
            .prefetch_related(
                "staff__user__informations",
                "staff__user__informations__children",
            )
        )


class AssignmentCreateAPIView(generics.CreateAPIView):
    serializer_class = AssignmentCreateSerializer

    permission_classes = [
        IsStaff |
        IsAdminOrSuperUser
    ]

    def get_queryset(self):
        return Assignment.objects.all()

    def perform_create(self, serializer):
        serializer.save()


class AssignmentUpdateAPIView(generics.UpdateAPIView):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentUpdateSerializer

    permission_classes = [
        IsStaff |
        IsAdminOrSuperUser
    ]

    lookup_field = "pk"


class AllAssignmentListAPIView(generics.ListAPIView):
    serializer_class = AllAssignmentListSerializer
    permission_classes = [IsAdminOrSuperUser]

    filter_backends = (
        SearchFilter,
        OrderingFilter,
    )

    search_fields = (
        "title",
        "description",
        "line__title",
    )

    ordering_fields = (
        "id",
        "title",
        "line__title",
        "created_at",
        "updated_at",
    )

    ordering = (
        "-created_at",
    )

    def get_queryset(self):
        return (
            Assignment.objects
            .select_related(
                "line",
                "parent",
            )
            .all()
        )

class StaffAssignmentListAPIView(generics.ListAPIView):
    serializer_class = AssignmentListSerializer

    permission_classes = [
        IsStaff |
        IsAdminOrSuperUser,
    ]

    filter_backends = (
        SearchFilter,
        OrderingFilter,
    )

    search_fields = (
        "title",
    )

    ordering_fields = (
        "id",
        "title",
        "created_at",
    )

    ordering = (
        "-created_at",
    )

    def get_queryset(self):
        line_id = self.kwargs["line_id"]
        user = self.request.user

        queryset = (
            Assignment.objects
            .filter(
                line_id=line_id,
            )
            .select_related(
                "line",
                "parent",
            )
        )

        # Admin / Superuser
        if (
            user.is_superuser
            or user.user_roles.filter(
                role__name="admin"
            ).exists()
        ):
            return queryset

        # Staff → فقط Lineهایی که خودش Staff آنهاست
        return queryset.filter(
            line__staff_memberships__staff__user=user,
        ).distinct()


class MemberAssignmentListAPIView(generics.ListAPIView):
    serializer_class = AssignmentListSerializer

    permission_classes = [
        IsAuthenticated,
    ]

    filter_backends = (
        SearchFilter,
        OrderingFilter,
    )

    search_fields = (
        "title",
    )

    ordering_fields = (
        "id",
        "title",
        "created_at",
    )

    ordering = (
        "-created_at",
    )

    def get_queryset(self):
        line_id = self.kwargs["line_id"]
        user = self.request.user

        return (
            Assignment.objects
            .filter(
                line_id=line_id,
                recipients__member__user=user,
            )
            .select_related(
                "line",
                "parent",
            )
            .distinct()
        )

class StaffAssignmentDetailAPIView(generics.RetrieveAPIView):
    serializer_class = AssignmentDetailSerializer
    permission_classes = [
        IsStaff |
        IsAdminOrSuperUser,
    ]

    lookup_url_kwarg = "assignment_id"

    def get_queryset(self):
        line_id = self.kwargs["line_id"]
        assignment_id = self.kwargs["assignment_id"]
        user = self.request.user

        queryset = (
            Assignment.objects
            .filter(
                id=assignment_id,
                line_id=line_id,
            )
            .select_related(
                "line",
                "parent",
            )
            .prefetch_related(
                "media_items__media",
                "recipients__member__user",
                "children",
            )
        )

        # Admin / Superuser
        if (
            user.is_superuser
            or user.user_roles.filter(
                role__name="admin"
            ).exists()
        ):
            return queryset

        # Staff
        staff = getattr(user, "staff", None)

        if staff is None:
            return queryset.none()

        return queryset.filter(
            line__staff_memberships__staff=staff,
        ).distinct()


class MemberAssignmentDetailAPIView(generics.RetrieveAPIView):
    serializer_class = AssignmentDetailSerializer
    permission_classes = [IsAuthenticated]

    lookup_url_kwarg = "assignment_id"

    def get_queryset(self):
        line_id = self.kwargs["line_id"]
        assignment_id = self.kwargs["assignment_id"]
        user = self.request.user

        return (
            Assignment.objects
            .filter(
                id=assignment_id,
                line_id=line_id,
                recipients__member__user=user,
            )
            .select_related(
                "line",
                "parent",
            )
            .prefetch_related(
                "media_items__media",
                "recipients__member__user",
                "children",
            )
            .distinct()
        )

class AssignmentSubmissionCreateAPIView(generics.CreateAPIView):
    serializer_class = AssignmentSubmissionCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_assignment_recipient(self):
        return get_object_or_404(
            AssignmentRecipient.objects.select_related(
                "assignment",
                "member",
                "member__user",
            ),
            assignment_id=self.kwargs["assignment_id"],
            member__user=self.request.user,
        )

    def perform_create(self, serializer):
        recipient = self.get_assignment_recipient()

        serializer.save(
            assignment_recipient=recipient,
        )

class AssignmentSubmissionUpdateAPIView(
    generics.UpdateAPIView
):
    serializer_class = AssignmentSubmissionUpdateSerializer
    permission_classes = [IsAuthenticated]

    http_method_names = ["put", "patch"]

    def get_queryset(self):
        return (
            AssignmentSubmission.objects
            .filter(
                assignment_recipient__assignment_id=self.kwargs[
                    "assignment_id"
                ],
                assignment_recipient__member__user=self.request.user,
            )
            .select_related(
                "assignment_recipient",
                "assignment_recipient__assignment",
                "assignment_recipient__member",
            )
        )



class StaffAssignmentSubmissionListAPIView(
    generics.ListAPIView
):
    serializer_class = AssignmentSubmissionListSerializer
    permission_classes = [
        IsStaff |
        IsAdminOrSuperUser,
    ]

    filter_backends = (
        SearchFilter,
        OrderingFilter,
    )

    search_fields = (
        "assignment_recipient__member__user__username",
        "assignment_recipient__member__user__first_name",
        "assignment_recipient__member__user__last_name",
        "assignment_recipient__member__user__phone_number",
    )

    ordering_fields = (
        "created_at",
        "updated_at",
        "assignment_recipient__member__user__username",
    )

    ordering = (
        "-created_at",
    )

    def get_queryset(self):
        assignment_id = self.kwargs["assignment_id"]
        line_id = self.kwargs["line_id"]
        user = self.request.user

        queryset = (
            AssignmentSubmission.objects
            .filter(
                assignment_recipient__assignment_id=assignment_id,
                assignment_recipient__assignment__line_id=line_id,
            )
            .select_related(
                "assignment_recipient",
                "assignment_recipient__member",
                "assignment_recipient__member__user",
            )
        )

        # Admin / Superuser
        if (
            user.is_superuser
            or user.user_roles.filter(
                role__name="admin"
            ).exists()
        ):
            return queryset

        # Staff
        staff = getattr(user, "staff", None)

        if not staff:
            return queryset.none()

        return queryset.filter(
            assignment_recipient__assignment__line__staff_memberships__staff=staff,
        ).distinct()

    def list(self, request, *args, **kwargs):
        assignment_id = kwargs["assignment_id"]
        line_id = kwargs["line_id"]

        search = request.query_params.get(
            "search",
            "",
        ).strip()

        ordering = request.query_params.get(
            "ordering",
            "",
        ).strip()

        page = request.query_params.get(
            "page",
            "1",
        )

        page_size = request.query_params.get(
            "page_size",
            "",
        )

        cache_key = (
            f"staff-assignment-submissions:"
            f"assignment:{assignment_id}:"
            f"lines:{line_id}:"
            f"user:{request.user.id}:"
            f"search:{search}:"
            f"ordering:{ordering}:"
            f"page:{page}:"
            f"page_size:{page_size}"
        )

        cached_data = cache.get(cache_key)

        if cached_data is not None:
            return Response(cached_data)

        queryset = self.filter_queryset(
            self.get_queryset()
        )

        page_obj = self.paginate_queryset(queryset)

        if page_obj is not None:
            serializer = self.get_serializer(
                page_obj,
                many=True,
            )

            response = self.get_paginated_response(
                serializer.data
            )

            cache.set(
                cache_key,
                response.data,
                timeout=60 * 5,
            )

            return response

        data = self.get_serializer(
            queryset,
            many=True,
        ).data

        cache.set(
            cache_key,
            data,
            timeout=60 * 5,
        )

        return Response(data)


class MemberAssignmentSubmissionListAPIView(
    generics.ListAPIView
):
    serializer_class = AssignmentSubmissionListSerializer
    permission_classes = [IsAuthenticated]

    filter_backends = (
        SearchFilter,
        OrderingFilter,
    )

    search_fields = (
        "assignment_recipient__member__user__username",
        "assignment_recipient__member__user__first_name",
        "assignment_recipient__member__user__last_name",
    )

    ordering_fields = (
        "created_at",
        "updated_at",
    )

    ordering = (
        "-created_at",
    )

    def get_queryset(self):
        assignment_id = self.kwargs["assignment_id"]
        line_id = self.kwargs["line_id"]
        user = self.request.user

        return (
            AssignmentSubmission.objects
            .filter(
                assignment_recipient__assignment_id=assignment_id,
                assignment_recipient__assignment__line_id=line_id,
                assignment_recipient__member__user=user,
            )
            .select_related(
                "assignment_recipient",
                "assignment_recipient__member",
                "assignment_recipient__member__user",
            )
        )

    def list(self, request, *args, **kwargs):
        assignment_id = kwargs["assignment_id"]
        line_id = kwargs["line_id"]

        search = request.query_params.get(
            "search",
            "",
        ).strip()

        ordering = request.query_params.get(
            "ordering",
            "",
        ).strip()

        page = request.query_params.get(
            "page",
            "1",
        )

        page_size = request.query_params.get(
            "page_size",
            "",
        )

        cache_key = (
            f"member-assignment-submissions:"
            f"assignment:{assignment_id}:"
            f"lines:{line_id}:"
            f"user:{request.user.id}:"
            f"search:{search}:"
            f"ordering:{ordering}:"
            f"page:{page}:"
            f"page_size:{page_size}"
        )

        cached_data = cache.get(cache_key)

        if cached_data is not None:
            return Response(cached_data)

        queryset = self.filter_queryset(
            self.get_queryset()
        )

        page_obj = self.paginate_queryset(queryset)

        if page_obj is not None:
            serializer = self.get_serializer(
                page_obj,
                many=True,
            )

            response = self.get_paginated_response(
                serializer.data
            )

            cache.set(
                cache_key,
                response.data,
                timeout=60 * 5,
            )

            return response

        data = self.get_serializer(
            queryset,
            many=True,
        ).data

        cache.set(
            cache_key,
            data,
            timeout=60 * 5,
        )

        return Response(data)


class StaffAssignmentSubmissionDetailAPIView(
    generics.RetrieveAPIView
):
    serializer_class = AssignmentSubmissionDetailSerializer
    permission_classes = [
        IsStaff |
        IsAdminOrSuperUser,
    ]

    lookup_url_kwarg = "submission_id"

    def get_queryset(self):
        line_id = self.kwargs["line_id"]
        assignment_id = self.kwargs["assignment_id"]
        user = self.request.user

        queryset = (
            AssignmentSubmission.objects
            .filter(
                assignment_recipient__assignment_id=assignment_id,
                assignment_recipient__assignment__line_id=line_id,
            )
            .select_related(
                "assignment_recipient",
                "assignment_recipient__assignment",
                "assignment_recipient__member",
                "assignment_recipient__member__user",
            )
            .prefetch_related(
                "media_items__media",
            )
        )

        if user.is_superuser or user.user_roles.filter(
            role__name="admin"
        ).exists():
            return queryset

        staff = getattr(user, "staff", None)

        if not staff:
            return queryset.none()

        return queryset.filter(
            assignment_recipient__assignment__line__staff_memberships__staff=staff,
        ).distinct()

    def retrieve(self, request, *args, **kwargs):
        cache_key = (
            f"staff-assignment-submission-detail:"
            f"lines:{kwargs['line_id']}:"
            f"assignment:{kwargs['assignment_id']}:"
            f"submission:{kwargs['submission_id']}:"
            f"user:{request.user.id}"
        )

        cached_data = cache.get(cache_key)

        if cached_data is not None:
            return Response(cached_data)

        instance = self.get_object()

        data = self.get_serializer(instance).data

        cache.set(
            cache_key,
            data,
            timeout=60 * 5,
        )

        return Response(data)


class MemberAssignmentSubmissionDetailAPIView(
    generics.RetrieveAPIView
):
    serializer_class = AssignmentSubmissionDetailSerializer
    permission_classes = [IsAuthenticated]

    lookup_url_kwarg = "submission_id"

    def get_queryset(self):
        return (
            AssignmentSubmission.objects
            .filter(
                assignment_recipient__assignment_id=self.kwargs["assignment_id"],
                assignment_recipient__assignment__line_id=self.kwargs["line_id"],
                assignment_recipient__member__user=self.request.user,
            )
            .select_related(
                "assignment_recipient",
                "assignment_recipient__assignment",
                "assignment_recipient__member",
                "assignment_recipient__member__user",
            )
            .prefetch_related(
                "media_items__media",
            )
        )

    def retrieve(self, request, *args, **kwargs):
        cache_key = (
            f"member-assignment-submission-detail:"
            f"lines:{kwargs['line_id']}:"
            f"assignment:{kwargs['assignment_id']}:"
            f"submission:{kwargs['submission_id']}:"
            f"user:{request.user.id}"
        )

        cached_data = cache.get(cache_key)

        if cached_data is not None:
            return Response(cached_data)

        instance = self.get_object()

        data = self.get_serializer(instance).data

        cache.set(
            cache_key,
            data,
            timeout=60 * 5,
        )

        return Response(data)


class AllAssignmentSubmissionListAPIView(generics.ListAPIView):
    serializer_class = AllAssignmentSubmissionListSerializer

    permission_classes = [
        IsAdminOrSuperUser,
    ]

    filter_backends = (
        SearchFilter,
        OrderingFilter,
    )

    search_fields = (
        "assignment_recipient__assignment__title",
        "assignment_recipient__member__user__username",
        "assignment_recipient__member__user__first_name",
        "assignment_recipient__member__user__last_name",
        "assignment_recipient__member__user__phone_number",
    )

    ordering_fields = (
        "created_at",
        "updated_at",
        "assignment_recipient__assignment__title",
        "assignment_recipient__member__user__first_name",
        "assignment_recipient__member__user__last_name",
    )

    ordering = (
        "-created_at",
    )

    def get_queryset(self):
        return (
            AssignmentSubmission.objects
            .select_related(
                "assignment_recipient",
                "assignment_recipient__assignment",
                "assignment_recipient__member",
                "assignment_recipient__member__user",
            )
            .order_by("-created_at")
        )

    def list(self, request, *args, **kwargs):
        search = request.query_params.get(
            "search",
            "",
        ).strip()

        ordering = request.query_params.get(
            "ordering",
            "",
        ).strip()

        page = request.query_params.get(
            "page",
            "1",
        )

        page_size = request.query_params.get(
            "page_size",
            "",
        )

        cache_key = (
            f"admin:all-assignment-submissions:"
            f"search:{search}:"
            f"ordering:{ordering}:"
            f"page:{page}:"
            f"page_size:{page_size}"
        )

        cached_data = cache.get(cache_key)

        if cached_data is not None:
            return Response(cached_data)

        queryset = self.filter_queryset(
            self.get_queryset()
        )

        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(
                page,
                many=True,
            )

            response = self.get_paginated_response(
                serializer.data
            )

            cache.set(
                cache_key,
                response.data,
                timeout=60 * 5,
            )

            return response

        serializer = self.get_serializer(
            queryset,
            many=True,
        )

        data = serializer.data

        cache.set(
            cache_key,
            data,
            timeout=60 * 5,
        )

        return Response(data)


class MemberConversationCreateAPIView(generics.CreateAPIView):
    serializer_class = MemberConversationCreateSerializer
    permission_classes = [IsAuthenticated]


class StaffConversationCreateAPIView(generics.CreateAPIView):
    serializer_class = StaffConversationCreateSerializer
    permission_classes = [IsStaff | IsAdminOrSuperUser]



class StaffConversationListAPIView(generics.ListAPIView):
    serializer_class = ConversationListSerializer
    permission_classes = [IsStaff]

    def get_queryset(self):
        return (
            Conversation.objects
            .filter(
                line__staff_memberships__staff=self.request.user.staff
            )
            .select_related("line")
            .distinct()
        )


class StaffConversationDetailAPIView(generics.RetrieveAPIView):
    serializer_class = ConversationDetailSerializer
    permission_classes = [IsStaff | IsAdminOrSuperUser]

    def get_queryset(self):
        return (
            Conversation.objects
            .filter(
                line__staff_memberships__staff=self.request.user.staff
            )
            .select_related("line")
            .prefetch_related(
                "messages__sender__user",
                "messages__media",
            )
            .distinct()
        )

class MemberConversationDetailAPIView(generics.RetrieveAPIView):
    serializer_class = ConversationDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Conversation.objects
            .filter(
                participants__user=self.request.user
            )
            .select_related("line")
            .prefetch_related(
                "messages__sender__user",
                "messages__media",
            )
            .distinct()
        )


class ConversationJoinAPIView(generics.GenericAPIView):
    serializer_class = ConversationJoinSerializer
    permission_classes = [IsStaff | IsAdminOrSuperUser]

    def get_serializer_context(self):
        context = super().get_serializer_context()

        conversation = get_object_or_404(
            Conversation.objects.select_related("line"),
            pk=self.kwargs["pk"],
        )

        context["conversation"] = conversation

        return context

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer()
        participant = serializer.save()

        return Response(
            {
                "id": participant.id,
                "conversation": participant.conversation_id,
                "user": participant.user_id,
            },
            status=status.HTTP_200_OK,
        )


class MessageCreateAPIView(generics.GenericAPIView):
    serializer_class = MessageCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_conversation(self):
        return get_object_or_404(
            Conversation.objects.select_related("line"),
            pk=self.kwargs["conversation_id"],
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()

        context["conversation"] = self.get_conversation()

        return context

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data,
        )

        serializer.is_valid(raise_exception=True)

        message = serializer.save()

        return Response(
            MessageSerializer(
                message,
                context={"request": request},
            ).data,
            status=status.HTTP_201_CREATED,
        )


class ContentCreateAPIView(generics.CreateAPIView):
    queryset = Content.objects.all()
    serializer_class = ContentCreateSerializer
    permission_classes = [
        IsStaff,
    ]


class ContentUpdateAPIView(generics.UpdateAPIView):
    serializer_class = ContentUpdateSerializer
    permission_classes = [
        IsAuthenticated,
        IsStaff,
    ]

    queryset = Content.objects.select_related(
        "line",
        "media",
    )

    def get_queryset(self):
        staff = getattr(self.request.user, "staff", None)

        if not staff:
            return Content.objects.none()

        return (
            Content.objects
            .filter(
                line__staff_memberships__staff=staff,
            )
            .select_related(
                "line",
                "media",
            )
            .prefetch_related(
                "recipients__member__user",
            )
            .distinct()
        )



class StaffContentListAPIView(generics.ListAPIView):
    serializer_class = ContentLineListSerializer

    permission_classes = [
        IsAuthenticated,
        IsStaff,
    ]

    filter_backends = (
        SearchFilter,
        OrderingFilter,
    )

    search_fields = (
        "title",
        "text",
    )

    ordering_fields = (
        "created_at",
        "updated_at",
        "title",
    )

    ordering = (
        "-created_at",
    )

    def get_queryset(self):
        staff = getattr(
            self.request.user,
            "staff",
            None,
        )

        if not staff:
            return Content.objects.none()

        return (
            Content.objects
            .filter(
                line__staff_memberships__staff=staff,
            )
            .select_related(
                "line",
                "parent",
            )
            .distinct()
        )

    def list(self, request, *args, **kwargs):
        search = request.query_params.get(
            "search",
            "",
        ).strip()

        ordering = request.query_params.get(
            "ordering",
            "-created_at",
        )

        page = request.query_params.get(
            "page",
            "1",
        )

        page_size = request.query_params.get(
            "page_size",
            "10",
        )

        staff = getattr(
            request.user,
            "staff",
            None,
        )

        if not staff:
            return Response({
                "results": [],
            })

        cache_key = (
            f"staff:{staff.id}:"
            f"contents:"
            f"search={search}:"
            f"ordering={ordering}:"
            f"page={page}:"
            f"page_size={page_size}"
        )

        cached_data = cache.get(cache_key)

        if cached_data is not None:
            return Response(cached_data)

        response = super().list(
            request,
            *args,
            **kwargs,
        )

        cache.set(
            cache_key,
            response.data,
            timeout=60 * 5,
        )

        return response


class MemberContentListAPIView(generics.ListAPIView):
    serializer_class = ContentLineListSerializer

    permission_classes = [
        IsAuthenticated,
    ]

    filter_backends = (
        SearchFilter,
        OrderingFilter,
    )

    search_fields = (
        "title",
        "text",
    )

    ordering_fields = (
        "created_at",
        "updated_at",
        "title",
    )

    ordering = (
        "-created_at",
    )

    def get_queryset(self):
        user = self.request.user

        return (
            Content.objects
            .filter(
                recipients__member__user=user,
                line__members__user=user,
            )
            .select_related(
                "line",
                "parent",
            )
            .distinct()
        )

    def list(self, request, *args, **kwargs):
        search = request.query_params.get(
            "search",
            "",
        ).strip()

        ordering = request.query_params.get(
            "ordering",
            "-created_at",
        )

        page = request.query_params.get(
            "page",
            "1",
        )

        page_size = request.query_params.get(
            "page_size",
            "10",
        )

        cache_key = (
            f"user:{request.user.id}:"
            f"member-contents:"
            f"search={search}:"
            f"ordering={ordering}:"
            f"page={page}:"
            f"page_size={page_size}"
        )

        cached_data = cache.get(cache_key)

        if cached_data is not None:
            return Response(cached_data)

        response = super().list(
            request,
            *args,
            **kwargs,
        )

        cache.set(
            cache_key,
            response.data,
            timeout=60 * 5,
        )

        return response



class StaffContentDetailAPIView(generics.RetrieveAPIView):
    serializer_class = ContentDetailSerializer
    permission_classes = [
        IsAuthenticated,
        IsAdminOrSuperUser,
    ]

    def get_queryset(self):
        user = self.request.user

        queryset = (
            Content.objects
            .select_related(
                "line",
                "media",
                "parent",
            )
            .prefetch_related(
                "recipients__member__user",
                "children",
            )
        )

        # Admin / Superuser → همه Contentها
        if (
            user.is_superuser
            or user.user_roles.filter(
                role__name="admin"
            ).exists()
        ):
            return queryset

        # Staff → فقط Lineهای خودش
        staff = getattr(user, "staff", None)

        if not staff:
            return Content.objects.none()

        return queryset.filter(
            line__staff_memberships__staff=staff,
        ).distinct()


class MemberContentDetailAPIView(generics.RetrieveAPIView):
    serializer_class = ContentDetailSerializer
    permission_classes = [
        IsAuthenticated,
    ]

    def get_queryset(self):
        user = self.request.user

        return (
            Content.objects
            .filter(
                line__members__user=user,
                recipients__member__user=user,
            )
            .select_related(
                "line",
                "media",
                "parent",
            )
            .prefetch_related(
                "recipients__member__user",
                "children",
            )
            .distinct()
        )


class AdminContentListAPIView(generics.ListAPIView):
    serializer_class = ContentListSerializer
    permission_classes = [
        IsAuthenticated,
        IsAdminOrSuperUser,
    ]

    filter_backends = (
        SearchFilter,
        OrderingFilter,
    )

    search_fields = (
        "title",
        "text",
        "line__title",
    )

    ordering_fields = (
        "created_at",
        "updated_at",
        "title",
    )

    ordering = (
        "-created_at",
    )

    def get_queryset(self):
        return (
            Content.objects
            .select_related(
                "line",
                "parent",
            )
            .order_by("-created_at")
        )