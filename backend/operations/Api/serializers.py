import json

from django.db import transaction
from rest_framework import serializers

from accounts.Api.v1.serializer import UserDetailSerializer
from accounts.models import Staff, User
from operations.models import (
    Assignment,
    AssignmentMedia,
    AssignmentRecipient,
    AssignmentSubmission,
    Content,
    ContentRecipient,
    Conversation,
    ConversationParticipant,
    Feature,
    Line,
    LineMember,
    Media,
    Message,
    StaffLine,
    SubmissionMedia, Form, ConsultationForm, SubmitConsultationForm,
)


class MediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Media
        fields = (
            "id",
            "text",
            "file",
        )


class FeatureSerializer(serializers.ModelSerializer):
    media = MediaSerializer(read_only=True)

    class Meta:
        model = Feature
        fields = (
            "id",
            "title",
            "text",
            "media",
            "parent",
        )


class LineListSerializer(serializers.ModelSerializer):
    children = serializers.PrimaryKeyRelatedField(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Line
        fields = (
            "id",
            "title",
            "descriptions",
            "parent",
            "children",
        )


class LineChildSerializer(serializers.ModelSerializer):
    features = FeatureSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Line
        fields = (
            "id",
            "title",
            "descriptions",
            "parent",
            "features",
        )


class LineDetailSerializer(serializers.ModelSerializer):
    features = FeatureSerializer(
        many=True,
        read_only=True,
    )

    children = LineChildSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Line
        fields = (
            "id",
            "title",
            "descriptions",
            "parent",
            "features",
            "children",
        )


class LineMemberSerializer(serializers.ModelSerializer):
    user = UserDetailSerializer(read_only=True)

    class Meta:
        model = LineMember
        fields = (
            "id",
            "user",
        )


class AddLineMembersSerializer(serializers.Serializer):
    user_ids = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        many=True,
        write_only=True,
    )

    def validate(self, attrs):
        line = self.context["lines"]
        users = attrs["user_ids"]

        existing_user_ids = set(
            LineMember.objects.filter(
                line=line,
                user__in=users,
            ).values_list("user_id", flat=True)
        )

        if existing_user_ids:
            raise serializers.ValidationError(
                {"user_ids": ("Some users are already members of this lines.")}
            )

        return attrs

    def create(self, validated_data):
        line = self.context["lines"]
        users = validated_data["user_ids"]

        memberships = [
            LineMember(
                line=line,
                user=user,
            )
            for user in users
        ]

        return LineMember.objects.bulk_create(memberships)


class RemoveLineMembersSerializer(serializers.Serializer):
    user_ids = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        many=True,
        write_only=True,
    )

    def validate(self, attrs):
        line = self.context["lines"]
        users = attrs["user_ids"]

        existing_user_ids = set(
            LineMember.objects.filter(
                line=line,
                user__in=users,
            ).values_list("user_id", flat=True)
        )

        requested_user_ids = {user.id for user in users}

        not_members = requested_user_ids - existing_user_ids

        if not_members:
            raise serializers.ValidationError(
                {
                    "user_ids": (
                        f"These users are not members of this lines: "
                        f"{sorted(not_members)}"
                    )
                }
            )

        return attrs


class StaffLineSerializer(serializers.ModelSerializer):
    staff = serializers.StringRelatedField()
    user = UserDetailSerializer(source="staff.user", read_only=True)

    # اضافه کردن فیلدهای استاف
    employee_code = serializers.CharField(source="staff.employee_code", read_only=True)
    hire_date = serializers.DateField(source="staff.hire_date", read_only=True)
    position = serializers.CharField(source="staff.position", read_only=True)

    class Meta:
        model = StaffLine
        fields = ("id", "staff", "user", "employee_code", "hire_date", "position")


class AddLineStaffSerializer(serializers.Serializer):
    staff_ids = serializers.PrimaryKeyRelatedField(
        queryset=Staff.objects.all(),
        many=True,
        write_only=True,
    )

    def validate(self, attrs):
        line = self.context["lines"]
        staff_members = attrs["staff_ids"]

        existing_ids = set(
            StaffLine.objects.filter(
                line=line,
                staff__in=staff_members,
            ).values_list("staff_id", flat=True)
        )

        if existing_ids:
            raise serializers.ValidationError(
                {
                    "staff_ids": (
                        "Some staff members are already assigned to this lines."
                    )
                }
            )

        return attrs

    def create(self, validated_data):
        line = self.context["lines"]
        staff_members = validated_data["staff_ids"]

        staff_lines = [
            StaffLine(
                line=line,
                staff=staff,
            )
            for staff in staff_members
        ]

        return StaffLine.objects.bulk_create(staff_lines)


class RemoveLineStaffSerializer(serializers.Serializer):
    staff_ids = serializers.PrimaryKeyRelatedField(
        queryset=Staff.objects.all(),
        many=True,
        write_only=True,
    )

    def validate(self, attrs):
        line = self.context["lines"]
        staff_members = attrs["staff_ids"]

        requested_ids = {staff.id for staff in staff_members}

        existing_ids = set(
            StaffLine.objects.filter(
                line=line,
                staff__in=staff_members,
            ).values_list("staff_id", flat=True)
        )

        not_members = requested_ids - existing_ids

        if not_members:
            raise serializers.ValidationError(
                {
                    "staff_ids": (
                        f"These staff are not assigned to this lines: "
                        f"{sorted(not_members)}"
                    )
                }
            )

        return attrs


class AssignmentMediaSerializer(serializers.ModelSerializer):
    media = MediaSerializer()

    class Meta:
        model = AssignmentMedia
        fields = (
            "id",
            "media",
        )


class AssignmentRecipientSerializer(serializers.ModelSerializer):
    member = LineMemberSerializer()

    class Meta:
        model = AssignmentRecipient
        fields = (
            "id",
            "member",
        )


class AssignmentCreateSerializer(serializers.ModelSerializer):
    member_ids = serializers.PrimaryKeyRelatedField(
        source="members",
        queryset=LineMember.objects.select_related("line", "user"),
        many=True,
        write_only=True,
    )

    media_items = AssignmentMediaSerializer(
        many=True,
        required=False,
    )

    class Meta:
        model = Assignment
        fields = (
            "id",
            "line",
            "title",
            "description",
            "parent",
            "member_ids",
            "media_items",
        )
        read_only_fields = ("id",)

    def validate(self, attrs):
        line = attrs["lines"]
        members = attrs.get("members", [])

        request = self.context["request"]
        user = request.user

        # Staff فعلی
        staff = getattr(user, "staff", None)

        if staff is None:
            raise serializers.ValidationError({"lines": "شما Staff نیستید."})

        # آیا Staff به این Line دسترسی دارد؟
        has_access = StaffLine.objects.filter(
            staff=staff,
            line=line,
        ).exists()

        if not has_access:
            raise serializers.ValidationError(
                {"lines": "شما به این Line دسترسی ندارید."}
            )

        # آیا همه Memberها متعلق به همین Line هستند؟
        invalid_members = [member.id for member in members if member.line_id != line.id]

        if invalid_members:
            raise serializers.ValidationError(
                {"member_ids": ("تمام اعضای انتخاب‌شده باید عضو همین Line باشند.")}
            )

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        media_items_data = validated_data.pop(
            "media_items",
            [],
        )

        members = validated_data.pop(
            "members",
            [],
        )

        assignment = Assignment.objects.create(**validated_data)

        for item_data in media_items_data:
            media_data = item_data.pop("media")

            media = Media.objects.create(**media_data)

            AssignmentMedia.objects.create(
                assignment=assignment,
                media=media,
            )

        AssignmentRecipient.objects.bulk_create(
            [
                AssignmentRecipient(
                    assignment=assignment,
                    member=member,
                )
                for member in members
            ]
        )

        return assignment


class AssignmentUpdateSerializer(serializers.ModelSerializer):
    member_ids = serializers.PrimaryKeyRelatedField(
        source="members",
        queryset=LineMember.objects.select_related(
            "line",
            "user",
        ),
        many=True,
        write_only=True,
        required=False,
    )

    media_items = AssignmentMediaSerializer(
        many=True,
        required=False,
    )

    class Meta:
        model = Assignment
        fields = (
            "id",
            "line",
            "title",
            "description",
            "parent",
            "member_ids",
            "media_items",
        )
        read_only_fields = ("id",)

    def validate(self, attrs):
        request = self.context["request"]
        user = request.user

        staff = getattr(user, "staff", None)

        if staff is None:
            raise serializers.ValidationError({"detail": "شما Staff نیستید."})

        # اگر lines در request آمده باشد،
        # همان Line جدید را بررسی می‌کنیم.
        # در غیر این صورت Line فعلی Assignment ملاک است.
        line = attrs.get(
            "lines",
            self.instance.line,
        )

        # Staff باید به Line دسترسی داشته باشد.
        if not StaffLine.objects.filter(
                staff=staff,
                line=line,
        ).exists():
            raise serializers.ValidationError(
                {"lines": "شما به این Line دسترسی ندارید."}
            )

        # اگر member_ids ارسال شده باشد،
        # همه باید عضو Line انتخاب‌شده باشند.
        members = attrs.get("members")

        if members is not None:
            invalid_members = [
                member.id for member in members if member.line_id != line.id
            ]

            if invalid_members:
                raise serializers.ValidationError(
                    {"member_ids": ("تمام اعضای انتخاب‌شده باید عضو همین Line باشند.")}
                )

        return attrs

    @transaction.atomic
    def update(self, instance, validated_data):
        media_items_data = validated_data.pop(
            "media_items",
            None,
        )

        members = validated_data.pop(
            "members",
            None,
        )

        # ---------------------------------
        # Assignment fields
        # ---------------------------------

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        # ---------------------------------
        # Recipients
        # ---------------------------------

        if members is not None:
            AssignmentRecipient.objects.filter(
                assignment=instance,
            ).delete()

            AssignmentRecipient.objects.bulk_create(
                [
                    AssignmentRecipient(
                        assignment=instance,
                        member=member,
                    )
                    for member in members
                ]
            )

        # ---------------------------------
        # Media
        # ---------------------------------

        if media_items_data is not None:
            # فقط Mediaهای متعلق به همین Assignment
            old_media_ids = list(
                AssignmentMedia.objects.filter(assignment=instance).values_list(
                    "media_id",
                    flat=True,
                )
            )

            # اول relation را حذف کن
            AssignmentMedia.objects.filter(assignment=instance).delete()

            # بعد خود Mediaهای متعلق به Assignment را حذف کن
            Media.objects.filter(id__in=old_media_ids).delete()

            # ساخت Mediaهای جدید
            assignment_media_objects = []

            for item_data in media_items_data:
                media_data = item_data["media"]

                media = Media.objects.create(**media_data)

                assignment_media_objects.append(
                    AssignmentMedia(
                        assignment=instance,
                        media=media,
                    )
                )

            AssignmentMedia.objects.bulk_create(assignment_media_objects)

        return instance


class AllAssignmentListSerializer(serializers.ModelSerializer):
    line = serializers.StringRelatedField()

    class Meta:
        model = Assignment
        fields = (
            "id",
            "line",
            "title",
            "description",
            "parent",
        )


class AssignmentListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = (
            "id",
            "title",
            "description",
            "parent",
            "created_at",
        )


class AssignmentDetailSerializer(serializers.ModelSerializer):
    media_items = AssignmentMediaSerializer(
        many=True,
        read_only=True,
    )

    recipients = AssignmentRecipientSerializer(
        many=True,
        read_only=True,
    )

    children = AssignmentListSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Assignment
        fields = (
            "id",
            "line",
            "title",
            "description",
            "parent",
            "media_items",
            "recipients",
            "children",
            "created_at",
            "updated_at",
        )


class AssignmentSubmissionCreateSerializer(serializers.ModelSerializer):
    media_items = MediaSerializer(
        many=True,
        required=False,
        write_only=True,
    )

    class Meta:
        model = AssignmentSubmission
        fields = (
            "assignment_recipient",
            "media_items",
        )
        read_only_fields = ("assignment_recipient",)

    @transaction.atomic
    def create(self, validated_data):
        media_items_data = validated_data.pop(
            "media_items",
            [],
        )

        submission = AssignmentSubmission.objects.create(**validated_data)

        submission_media_objects = []

        for media_data in media_items_data:
            media = Media.objects.create(**media_data)

            submission_media_objects.append(
                SubmissionMedia(
                    submission=submission,
                    media=media,
                )
            )

        SubmissionMedia.objects.bulk_create(submission_media_objects)

        return submission


class AssignmentSubmissionUpdateSerializer(serializers.ModelSerializer):
    media_items = MediaSerializer(
        many=True,
        required=False,
        write_only=True,
    )

    class Meta:
        model = AssignmentSubmission
        fields = ("media_items",)

    @transaction.atomic
    def update(self, instance, validated_data):
        media_items_data = validated_data.pop(
            "media_items",
            None,
        )

        # سایر فیلدها
        for attr, value in validated_data.items():
            setattr(
                instance,
                attr,
                value,
            )

        instance.save()

        if media_items_data is not None:
            # Mediaهای قبلی همین Submission
            old_media_ids = list(
                SubmissionMedia.objects.filter(submission=instance).values_list(
                    "media_id",
                    flat=True,
                )
            )

            # حذف relation
            SubmissionMedia.objects.filter(submission=instance).delete()

            # چون Media اختصاصی Submission است،
            # خود Mediaهای قبلی را هم حذف می‌کنیم
            Media.objects.filter(id__in=old_media_ids).delete()

            # ساخت Mediaهای جدید
            submission_media_objects = []

            for media_data in media_items_data:
                media = Media.objects.create(**media_data)

                submission_media_objects.append(
                    SubmissionMedia(
                        submission=instance,
                        media=media,
                    )
                )

            SubmissionMedia.objects.bulk_create(submission_media_objects)

        return instance


class AssignmentSubmissionListSerializer(serializers.ModelSerializer):
    member = serializers.CharField(
        source="assignment_recipient.member.user",
        read_only=True,
    )

    class Meta:
        model = AssignmentSubmission
        fields = (
            "id",
            "member",
            "created_at",
            "updated_at",
        )


class SubmissionMediaDetailSerializer(serializers.ModelSerializer):
    media = MediaSerializer(read_only=True)

    class Meta:
        model = SubmissionMedia
        fields = (
            "id",
            "media",
        )


class AssignmentSubmissionDetailSerializer(serializers.ModelSerializer):
    member = serializers.CharField(
        source="assignment_recipient.member.user",
        read_only=True,
    )

    assignment = serializers.PrimaryKeyRelatedField(
        source="assignment_recipient.assignment",
        read_only=True,
    )

    media_items = SubmissionMediaDetailSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = AssignmentSubmission
        fields = (
            "id",
            "assignment",
            "member",
            "media_items",
            "created_at",
            "updated_at",
        )


class AllAssignmentSubmissionListSerializer(serializers.ModelSerializer):
    assignment = serializers.CharField(
        source="assignment_recipient.assignment.title",
        read_only=True,
    )

    member = serializers.StringRelatedField(
        source="assignment_recipient.member.user",
    )

    class Meta:
        model = AssignmentSubmission
        fields = (
            "id",
            "assignment",
            "member",
            "created_at",
            "updated_at",
        )


class MemberConversationCreateSerializer(serializers.ModelSerializer):
    line = serializers.PrimaryKeyRelatedField(
        queryset=Line.objects.all(),
        write_only=True,
    )

    class Meta:
        model = Conversation
        fields = (
            "id",
            "line",
        )
        read_only_fields = ("id",)

    def validate(self, attrs):
        request = self.context["request"]
        line = attrs["lines"]

        member = LineMember.objects.filter(
            user=request.user,
            line=line,
        ).first()

        if not member:
            raise serializers.ValidationError(
                {"lines": "You are not a member of this lines."}
            )

        attrs["member"] = member

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        request = self.context["request"]

        line = validated_data["lines"]
        member = validated_data["member"]

        conversation, created = Conversation.objects.get_or_create(
            line=line,
            member=member,
        )

        ConversationParticipant.objects.get_or_create(
            conversation=conversation,
            user=member.user,
        )

        return conversation


class StaffConversationCreateSerializer(serializers.ModelSerializer):
    line = serializers.PrimaryKeyRelatedField(
        queryset=Line.objects.all(),
        write_only=True,
    )

    member = serializers.PrimaryKeyRelatedField(
        queryset=LineMember.objects.all(),
        write_only=True,
    )

    class Meta:
        model = Conversation
        fields = (
            "id",
            "line",
            "member",
        )
        read_only_fields = ("id",)

    def validate(self, attrs):
        request = self.context["request"]

        line = attrs["lines"]
        member = attrs["member"]

        # Staff عضو این Line هست؟
        if not StaffLine.objects.filter(
                staff=request.user.staff,
                line=line,
        ).exists():
            raise serializers.ValidationError(
                {"lines": "You are not a staff member of this lines."}
            )

        # Member عضو همین Line هست؟
        if member.line_id != line.id:
            raise serializers.ValidationError(
                {"member": "Selected member does not belong to this lines."}
            )

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        request = self.context["request"]

        line = validated_data["lines"]
        member = validated_data["member"]

        conversation, created = Conversation.objects.get_or_create(
            line=line,
            member=member,
        )

        # Member
        ConversationParticipant.objects.get_or_create(
            conversation=conversation,
            user=member.user,
        )

        # Staff
        ConversationParticipant.objects.get_or_create(
            conversation=conversation,
            user=request.user,
        )

        return conversation


class ConversationListSerializer(serializers.ModelSerializer):
    line = serializers.StringRelatedField()

    class Meta:
        model = Conversation
        fields = (
            "id",
            "line",
            "created_at",
            "updated_at",
        )


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.CharField(
        source="sender.user",
        read_only=True,
    )

    media = MediaSerializer(
        read_only=True,
    )

    class Meta:
        model = Message
        fields = (
            "id",
            "sender",
            "media",
            "created_at",
        )


class ConversationDetailSerializer(serializers.ModelSerializer):
    line = serializers.StringRelatedField()

    messages = MessageSerializer(
        many=True,
        read_only=True,
    )

    class Meta:
        model = Conversation
        fields = (
            "id",
            "line",
            "messages",
            "created_at",
            "updated_at",
        )


class ConversationJoinSerializer(serializers.Serializer):
    def save(self, **kwargs):
        request = self.context["request"]
        conversation = self.context["conversation"]

        if not StaffLine.objects.filter(
                staff=request.user.staff,
                line=conversation.line,
        ).exists():
            raise serializers.ValidationError(
                "You are not a staff member of this lines."
            )

        participant, created = ConversationParticipant.objects.get_or_create(
            conversation=conversation,
            user=request.user,
        )

        return participant


class MessageCreateSerializer(serializers.ModelSerializer):
    media = MediaSerializer(
        required=False,
    )

    class Meta:
        model = Message
        fields = ("media",)

    def validate(self, attrs):
        request = self.context["request"]
        conversation = self.context["conversation"]

        participant = ConversationParticipant.objects.filter(
            conversation=conversation,
            user=request.user,
        ).first()

        if not participant:
            raise serializers.ValidationError(
                "You are not a participant of this conversation."
            )

        attrs["_participant"] = participant

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        participant = validated_data.pop("_participant")
        media_data = validated_data.pop("media", None)

        media = None

        if media_data:
            media = Media.objects.create(**media_data)

        return Message.objects.create(
            conversation=participant.conversation,
            sender=participant,
            media=media,
        )


class ContentCreateSerializer(serializers.ModelSerializer):
    member_ids = serializers.PrimaryKeyRelatedField(
        source="members",
        queryset=LineMember.objects.all(),
        many=True,
        write_only=True,
        required=False,
    )

    media = MediaSerializer(
        many=True,
        required=False,
    )

    class Meta:
        model = Content
        fields = (
            "id",
            "line",
            "title",
            "text",
            "media",
            "parent",
            "member_ids",
        )
        read_only_fields = ("id",)

    def validate(self, attrs):
        request = self.context["request"]
        line = attrs.get("line")
        members = attrs.get("members", [])
        parent = attrs.get("parent")

        if not line:
            raise serializers.ValidationError({"line": "This field is required."})

        staff = getattr(request.user, "staff", None)

        if not staff:
            raise serializers.ValidationError(
                {"line": "Only staff members can create content."}
            )
        if not staff.user.is_superuser:
            if not StaffLine.objects.filter(
                    staff=staff,
                    line=line,
            ).exists():
                raise serializers.ValidationError(
                    {"line": "You are not a staff member of this line."}
                )

        # جدید: parent باید متعلق به همان line باشد
        if parent is not None and parent.line_id != line.id:
            raise serializers.ValidationError(
                {"parent": "Parent content must belong to the same line."}
            )

        invalid_members = [member.id for member in members if member.line_id != line.id]

        if invalid_members:
            raise serializers.ValidationError(
                {"member_ids": ("Selected members must belong to the selected line.")}
            )

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        members = validated_data.pop("members", [])
        media_data = validated_data.pop("media", [])

        content = Content.objects.create(
            **validated_data,
        )

        Media.objects.bulk_create(
            [
                Media(
                    content=content,
                    **media,
                )
                for media in media_data
            ]
        )

        ContentRecipient.objects.bulk_create(
            [
                ContentRecipient(
                    content=content,
                    member=member,
                )
                for member in members
            ]
        )

        return content


class ContentUpdateSerializer(serializers.ModelSerializer):
    member_ids = serializers.PrimaryKeyRelatedField(
        source="members",
        queryset=LineMember.objects.all(),
        many=True,
        write_only=True,
        required=False,
    )

    media = MediaSerializer(
        many=True,
        required=False,
    )

    existing_media_ids = serializers.PrimaryKeyRelatedField(
        queryset=Media.objects.all(),
        many=True,
        write_only=True,
        required=False,
    )

    class Meta:
        model = Content
        fields = (
            "id",
            "line",
            "title",
            "text",
            "media",
            "parent",
            "member_ids",
            "existing_media_ids",
        )
        read_only_fields = ("id",)

    def validate(self, attrs):
        request = self.context["request"]

        line = attrs.get("line", self.instance.line)
        members = attrs.get("members")

        staff = getattr(request.user, "staff", None)

        if not staff:
            raise serializers.ValidationError(
                {"detail": "Only staff members can update content."}
            )

        if not StaffLine.objects.filter(
                staff=staff,
                line=line,
        ).exists():
            raise serializers.ValidationError(
                {"line": "You are not a staff member of this line."}
            )

        if members is not None:
            invalid_members = [
                member.id for member in members if member.line_id != line.id
            ]

            if invalid_members:
                raise serializers.ValidationError(
                    {
                        "member_ids": (
                            "Selected members must belong to the selected line."
                        )
                    }
                )

        # existing_media_ids باید متعلق به همین content باشند، وگرنه یک
        # کلاینت می‌تواند با فرستادن id یک Media از محتوای دیگر، آن را
        # به این محتوا "بدزدد" (چون existing_media_ids فقط "نگه‌داشتن"
        # را کنترل می‌کند و ownership را از instance موجود جدا می‌کند).
        existing_ids = attrs.get("existing_media_ids")
        if existing_ids is not None:
            foreign = [
                media.id for media in existing_ids
                if media.content_id != self.instance.id
            ]
            if foreign:
                raise serializers.ValidationError(
                    {"existing_media_ids": "Some media do not belong to this content."}
                )

        return attrs

    @transaction.atomic
    def update(self, instance, validated_data):
        print(validated_data)
        members = validated_data.pop("members", None)
        media_data = validated_data.pop("media", None)
        kept_media = validated_data.pop("existing_media_ids", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # --------------------------------
        # Media: حذف آن‌هایی که در existing_media_ids نیستند (اگر این
        # فیلد اصلاً ارسال شده باشد؛ اگر ارسال نشود یعنی کاری با
        # media های قبلی نداریم)، بعد افزودن media های تازه.
        # --------------------------------
        if kept_media is not None:
            kept_ids = {media.id for media in kept_media}
            instance.media.exclude(id__in=kept_ids).delete()

        if media_data:
            Media.objects.bulk_create([
                Media(content=instance, **media)
                for media in media_data
            ])

        # --------------------------------
        # Recipients
        # --------------------------------
        if members is not None:
            ContentRecipient.objects.filter(content=instance).delete()
            ContentRecipient.objects.bulk_create([
                ContentRecipient(content=instance, member=member)
                for member in members
            ])

        return instance


class ContentLineListSerializer(serializers.ModelSerializer):
    line = LineListSerializer()

    class Meta:
        model = Content
        fields = (
            "id",
            "line",
            "title",
            "text",
            "parent",
            "created_at",
            "updated_at",
        )


class ContentRecipientSerializer(serializers.ModelSerializer):
    member = LineMemberSerializer(read_only=True)

    class Meta:
        model = ContentRecipient
        fields = (
            "id",
            "member",
        )


class ContentDetailSerializer(serializers.ModelSerializer):
    line = LineDetailSerializer()

    media = MediaSerializer(read_only=True, many=True)

    recipients = ContentRecipientSerializer(
        many=True,
        read_only=True,
    )

    children = serializers.SerializerMethodField()

    class Meta:
        model = Content
        fields = (
            "id",
            "line",
            "title",
            "text",
            "media",
            "parent",
            "children",
            "recipients",
            "created_at",
            "updated_at",
        )

    def get_children(self, obj):
        return ContentLineListSerializer(
            obj.children.all(),
            many=True,
        ).data


class ContentListSerializer(serializers.ModelSerializer):
    line = serializers.StringRelatedField()

    class Meta:
        model = Content
        fields = (
            "id",
            "line",
            "title",
            "text",
            "parent",
            "created_at",
            "updated_at",
        )


class FormSerializer(serializers.ModelSerializer):
    class Meta:
        model = Form
        fields = ["id", "file"]


class ConsultationFormSerializer(serializers.ModelSerializer):
    forms = FormSerializer(
        source="form",
        many=True,
        read_only=True
    )

    class Meta:
        model = ConsultationForm
        fields = [
            "id",
            "title",
            "description",
            "forms",
        ]


class SubmitConsultationFormSerializer(serializers.ModelSerializer):
    forms = FormSerializer(source="form", many=True, read_only=True)

    class Meta:
        model = SubmitConsultationForm
        # فیلدهای consultation و member را از fields حذف کنید یا read_only بگذارید
        # اگر write_only هستند، باید در create هندل شوند
        fields = ["id", "title", "description", "forms"]

    def create(self, validated_data):
        # گرفتن مقادیر از context که توسط ویو ست شده‌اند
        consultation = self.context.get('consultation')
        member = self.context.get('member')

        if not consultation or not member:
            raise serializers.ValidationError("Context information is missing.")

        # ساخت آبجکت با مقادیر صحیح
        return SubmitConsultationForm.objects.create(
            consultation=consultation,
            member=member,
            **validated_data
        )

# operations/Api/serializers.py

class ConsultationFormCreateUpdateSerializer(serializers.ModelSerializer):
    files = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False,
    )
    existing_file_ids = serializers.ListField(
        child=serializers.UUIDField(),  # یا CharField بسته به نوع ID شما
        write_only=True,
        required=False,
    )
    forms = FormSerializer(
        source="form",
        many=True,
        read_only=True,
    )

    class Meta:
        model = ConsultationForm
        fields = ["id", "title", "description", "forms", "files", "existing_file_ids"]
        # خط line را از fields حذف کردیم چون دستی هندل می‌شود

    @transaction.atomic
    def create(self, validated_data):
        files = validated_data.pop("files", [])
        # line از طریق serializer.save(line=line_obj) در validated_data قرار می‌گیرد
        line = validated_data.pop("line", None)

        instance = ConsultationForm.objects.create(
            line=line,
            **validated_data
        )

        if files:
            Form.objects.bulk_create(
                [Form(consultation=instance, file=file) for file in files]
            )
        return instance

    @transaction.atomic
    def update(self, instance, validated_data):
        files = validated_data.pop("files", None)
        kept_file_ids = validated_data.pop("existing_file_ids", None)

        # آپدیت فیلدهای ساده
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # مدیریت فایل‌های قدیمی
        if kept_file_ids is not None:
            # حذف فایل‌هایی که IDشان در لیست نگهداری نیست
            instance.form.exclude(id__in=kept_file_ids).delete()

        # افزودن فایل‌های جدید
        if files:
            Form.objects.bulk_create([
                Form(consultation=instance, file=file) for file in files
            ])

        return instance


class SubmitConsultationFormCreateUpdateSerializer(serializers.ModelSerializer):
    forms = FormSerializer(
        source="form",
        many=True,
        read_only=True,
    )

    files = serializers.ListField(
        child=serializers.FileField(),
        write_only=True,
        required=False,
    )

    existing_file_ids = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = SubmitConsultationForm
        fields = [
            "id",
            "consultation",
            "member",
            "title",
            "description",
            "forms",
            "files",
            "existing_file_ids",
        ]

        read_only_fields = [
            "id",
            "consultation",
            "member",
            "forms",
        ]

    def validate_existing_file_ids(self, value):
        try:
            ids = json.loads(value)
        except (TypeError, ValueError):
            raise serializers.ValidationError("فرمت existing_file_ids نامعتبر است.")
        if not isinstance(ids, list):
            raise serializers.ValidationError("existing_file_ids باید یک لیست باشد.")
        return ids

    @transaction.atomic
    def create(self, validated_data):
        files = validated_data.pop("files", [])
        # existing_file_ids در create معنایی ندارد (چیزی برای نگه داشتن
        # وجود ندارد چون submission تازه ساخته می‌شود)
        validated_data.pop("existing_file_ids", None)

        consultation = self.context["consultation"]
        member = self.context["member"]

        if SubmitConsultationForm.objects.filter(
                consultation=consultation,
                member=member,
        ).exists():
            raise serializers.ValidationError(
                {"detail": "شما قبلاً برای این فرم Submission ثبت کرده‌اید."}
            )

        instance = SubmitConsultationForm.objects.create(
            consultation=consultation,
            member=member,
            **validated_data,
        )

        if files:
            Form.objects.bulk_create([
                Form(submission=instance, file=file)
                for file in files
            ])

        return instance

    @transaction.atomic
    def update(self, instance, validated_data):
        files = validated_data.pop("files", None)
        kept_file_ids = validated_data.pop("existing_file_ids", None)

        validated_data.pop("consultation", None)
        validated_data.pop("member", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if kept_file_ids is not None:
            instance.form.exclude(id__in=kept_file_ids).delete()

        if files:
            Form.objects.bulk_create([
                Form(submission=instance, file=file)
                for file in files
            ])

        return instance


class SubmitConsultationFormListSerializer(serializers.ModelSerializer):
    forms = FormSerializer(
        source="form",
        many=True,
        read_only=True,
    )

    member_id = serializers.UUIDField(
        source="member.id",
        read_only=True,
    )

    user = UserDetailSerializer(source="member.user", read_only=True)

    class Meta:
        model = SubmitConsultationForm

        fields = [
            "id",
            "member_id",
            "user",
            "title",
            "description",
            "forms",
            "created_at",
        ]
