from django.db import transaction
from rest_framework import serializers

from accounts.Api.v1.serializer import UserDetailSerializer
from accounts.models import User, Staff
from operations.models import Line, Feature, Media, LineMember, StaffLine, Assignment, AssignmentRecipient, \
    AssignmentMedia, SubmissionMedia, AssignmentSubmission, ConversationParticipant, Conversation, Message, \
    ContentRecipient, Content


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
            raise serializers.ValidationError({
                "user_ids": (
                    "Some users are already members of this lines."
                )
            })

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
            raise serializers.ValidationError({
                "user_ids": (
                    f"These users are not members of this lines: "
                    f"{sorted(not_members)}"
                )
            })

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
            raise serializers.ValidationError({
                "staff_ids": (
                    "Some staff members are already assigned to this lines."
                )
            })

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
            raise serializers.ValidationError({
                "staff_ids": (
                    f"These staff are not assigned to this lines: "
                    f"{sorted(not_members)}"
                )
            })

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
        read_only_fields = (
            "id",
        )

    def validate(self, attrs):
        line = attrs["line"]
        members = attrs.get("members", [])

        request = self.context["request"]
        user = request.user

        # Staff فعلی
        staff = getattr(user, "staff", None)

        if staff is None:
            raise serializers.ValidationError({
                "lines": "شما Staff نیستید."
            })

        # آیا Staff به این Line دسترسی دارد؟
        has_access = StaffLine.objects.filter(
            staff=staff,
            line=line,
        ).exists()

        if not has_access:
            raise serializers.ValidationError({
                "lines": "شما به این Line دسترسی ندارید."
            })

        # آیا همه Memberها متعلق به همین Line هستند؟
        invalid_members = [
            member.id
            for member in members
            if member.line_id != line.id
        ]

        if invalid_members:
            raise serializers.ValidationError({
                "member_ids": (
                    "تمام اعضای انتخاب‌شده باید عضو همین Line باشند."
                )
            })

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

        assignment = Assignment.objects.create(
            **validated_data
        )

        for item_data in media_items_data:
            media_data = item_data.pop("media")

            media = Media.objects.create(
                **media_data
            )

            AssignmentMedia.objects.create(
                assignment=assignment,
                media=media,
            )

        AssignmentRecipient.objects.bulk_create([
            AssignmentRecipient(
                assignment=assignment,
                member=member,
            )
            for member in members
        ])

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
        read_only_fields = (
            "id",
        )

    def validate(self, attrs):
        request = self.context["request"]
        user = request.user

        staff = getattr(user, "staff", None)

        if staff is None:
            raise serializers.ValidationError({
                "detail": "شما Staff نیستید."
            })

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
            raise serializers.ValidationError({
                "lines": "شما به این Line دسترسی ندارید."
            })

        # اگر member_ids ارسال شده باشد،
        # همه باید عضو Line انتخاب‌شده باشند.
        members = attrs.get("members")

        if members is not None:
            invalid_members = [
                member.id
                for member in members
                if member.line_id != line.id
            ]

            if invalid_members:
                raise serializers.ValidationError({
                    "member_ids": (
                        "تمام اعضای انتخاب‌شده باید "
                        "عضو همین Line باشند."
                    )
                })

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

            AssignmentRecipient.objects.bulk_create([
                AssignmentRecipient(
                    assignment=instance,
                    member=member,
                )
                for member in members
            ])

        # ---------------------------------
        # Media
        # ---------------------------------

        if media_items_data is not None:

            # فقط Mediaهای متعلق به همین Assignment
            old_media_ids = list(
                AssignmentMedia.objects
                .filter(
                    assignment=instance
                )
                .values_list(
                    "media_id",
                    flat=True,
                )
            )

            # اول relation را حذف کن
            AssignmentMedia.objects.filter(
                assignment=instance
            ).delete()

            # بعد خود Mediaهای متعلق به Assignment را حذف کن
            Media.objects.filter(
                id__in=old_media_ids
            ).delete()

            # ساخت Mediaهای جدید
            assignment_media_objects = []

            for item_data in media_items_data:
                media_data = item_data["media"]

                media = Media.objects.create(
                    **media_data
                )

                assignment_media_objects.append(
                    AssignmentMedia(
                        assignment=instance,
                        media=media,
                    )
                )

            AssignmentMedia.objects.bulk_create(
                assignment_media_objects
            )

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
        read_only_fields = (
            "assignment_recipient",
        )

    @transaction.atomic
    def create(self, validated_data):
        media_items_data = validated_data.pop(
            "media_items",
            [],
        )

        submission = AssignmentSubmission.objects.create(
            **validated_data
        )

        submission_media_objects = []

        for media_data in media_items_data:
            media = Media.objects.create(
                **media_data
            )

            submission_media_objects.append(
                SubmissionMedia(
                    submission=submission,
                    media=media,
                )
            )

        SubmissionMedia.objects.bulk_create(
            submission_media_objects
        )

        return submission



class AssignmentSubmissionUpdateSerializer(
    serializers.ModelSerializer
):
    media_items = MediaSerializer(
        many=True,
        required=False,
        write_only=True,
    )

    class Meta:
        model = AssignmentSubmission
        fields = (
            "media_items",
        )

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
                SubmissionMedia.objects
                .filter(
                    submission=instance
                )
                .values_list(
                    "media_id",
                    flat=True,
                )
            )

            # حذف relation
            SubmissionMedia.objects.filter(
                submission=instance
            ).delete()

            # چون Media اختصاصی Submission است،
            # خود Mediaهای قبلی را هم حذف می‌کنیم
            Media.objects.filter(
                id__in=old_media_ids
            ).delete()

            # ساخت Mediaهای جدید
            submission_media_objects = []

            for media_data in media_items_data:
                media = Media.objects.create(
                    **media_data
                )

                submission_media_objects.append(
                    SubmissionMedia(
                        submission=instance,
                        media=media,
                    )
                )

            SubmissionMedia.objects.bulk_create(
                submission_media_objects
            )

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
        read_only_fields = (
            "id",
        )

    def validate(self, attrs):
        request = self.context["request"]
        line = attrs["lines"]

        member = LineMember.objects.filter(
            user=request.user,
            line=line,
        ).first()

        if not member:
            raise serializers.ValidationError({
                "lines": "You are not a member of this lines."
            })

        attrs["member"] = member

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        request = self.context["request"]

        line = validated_data["lines"]
        member = validated_data["member"]

        conversation, created = (
            Conversation.objects.get_or_create(
                line=line,
                member=member,
            )
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
        read_only_fields = (
            "id",
        )

    def validate(self, attrs):
        request = self.context["request"]

        line = attrs["lines"]
        member = attrs["member"]

        # Staff عضو این Line هست؟
        if not StaffLine.objects.filter(
            staff=request.user.staff,
            line=line,
        ).exists():
            raise serializers.ValidationError({
                "lines": "You are not a staff member of this lines."
            })

        # Member عضو همین Line هست؟
        if member.line_id != line.id:
            raise serializers.ValidationError({
                "member": "Selected member does not belong to this lines."
            })

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        request = self.context["request"]

        line = validated_data["lines"]
        member = validated_data["member"]

        conversation, created = (
            Conversation.objects.get_or_create(
                line=line,
                member=member,
            )
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

        participant, created = (
            ConversationParticipant.objects.get_or_create(
                conversation=conversation,
                user=request.user,
            )
        )

        return participant



class MessageCreateSerializer(serializers.ModelSerializer):
    media = MediaSerializer(
        required=False,
    )

    class Meta:
        model = Message
        fields = (
            "media",
        )

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
            media = Media.objects.create(
                **media_data
            )

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
        read_only_fields = (
            "id",
        )

    def validate(self, attrs):
        request = self.context["request"]
        line = attrs.get("line")
        members = attrs.get("members", [])
        parent = attrs.get("parent")

        if not line:
            raise serializers.ValidationError({"line": "This field is required."})

        staff = getattr(request.user, "staff", None)

        if not staff:
            raise serializers.ValidationError({
                "line": "Only staff members can create content."
            })
        if not staff.user.is_superuser:
            if not StaffLine.objects.filter(
                    staff=staff,
                    line=line,
            ).exists():
                raise serializers.ValidationError({
                    "line": "You are not a staff member of this line."
                })

        # جدید: parent باید متعلق به همان line باشد
        if parent is not None and parent.line_id != line.id:
            raise serializers.ValidationError({
                "parent": "Parent content must belong to the same line."
            })

        invalid_members = [
            member.id
            for member in members
            if member.line_id != line.id
        ]

        if invalid_members:
            raise serializers.ValidationError({
                "member_ids": (
                    "Selected members must belong to the selected line."
                )
            })

        return attrs

    @transaction.atomic
    def create(self, validated_data):
        members = validated_data.pop("members", [])
        media_data = validated_data.pop("media", [])

        content = Content.objects.create(
            **validated_data,
        )

        Media.objects.bulk_create([
            Media(
                content=content,
                **media,
            )
            for media in media_data
        ])

        ContentRecipient.objects.bulk_create([
            ContentRecipient(
                content=content,
                member=member,
            )
            for member in members
        ])

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
        required=False,
        allow_null=True,
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
        read_only_fields = (
            "id",
        )

    def validate(self, attrs):
        request = self.context["request"]

        line = attrs.get(
            "lines",
            self.instance.line,
        )

        members = attrs.get("members")

        # --------------------------------
        # Check Staff
        # --------------------------------

        staff = getattr(request.user, "staff", None)

        if not staff:
            raise serializers.ValidationError({
                "detail": "Only staff members can update content."
            })

        # --------------------------------
        # Check Staff belongs to Line
        # --------------------------------

        if not StaffLine.objects.filter(
            staff=staff,
            line=line,
        ).exists():
            raise serializers.ValidationError({
                "lines": "You are not a staff member of this lines."
            })

        # --------------------------------
        # Check Members
        # --------------------------------

        if members is not None:
            invalid_members = [
                member.id
                for member in members
                if member.line_id != line.id
            ]

            if invalid_members:
                raise serializers.ValidationError({
                    "member_ids": (
                        "Selected members must belong to the selected lines."
                    )
                })

        return attrs

    @transaction.atomic
    def update(self, instance, validated_data):

        # --------------------------------
        # Members
        # --------------------------------

        members = validated_data.pop(
            "members",
            None,
        )

        # --------------------------------
        # Media
        # --------------------------------

        media_provided = "media" in validated_data

        media_data = validated_data.pop(
            "media",
            None,
        )

        # --------------------------------
        # Update normal fields
        # --------------------------------

        for attr, value in validated_data.items():
            setattr(
                instance,
                attr,
                value,
            )

        # --------------------------------
        # Update Media
        # --------------------------------

        if media_provided:

            old_media = instance.media

            if media_data is not None:

                new_media = Media.objects.create(
                    **media_data
                )

                instance.media = new_media

            else:
                instance.media = None

            instance.save()

            # حذف Media قبلی
            if old_media:
                old_media.delete()

        else:
            instance.save()

        # --------------------------------
        # Replace Recipients
        # --------------------------------

        if members is not None:

            ContentRecipient.objects.filter(
                content=instance
            ).delete()

            ContentRecipient.objects.bulk_create([
                ContentRecipient(
                    content=instance,
                    member=member,
                )
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

    media = MediaSerializer(
        read_only=True,
        many=True
    )

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