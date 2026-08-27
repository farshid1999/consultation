from django.db import models

from accounts.models import Staff
from config import settings
from core.models import BaseModel


# Create your models here.


class InviteRule(BaseModel):
    pass

    def __str__(self):
        return f"InviteRule #{self.pk}"



class Line(BaseModel):
    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="children",
    )

    title = models.CharField(
        max_length=255,
    )

    descriptions = models.TextField(
        blank=True,
    )

    def __str__(self):
        return self.title



class LineMember(BaseModel):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="line_memberships",
    )
    line = models.ForeignKey(
        Line,
        on_delete=models.CASCADE,
        related_name="members",
    )

    class Meta:
        constraints = [
            # مطمئن شوید نام فیلدها دقیقاً همان چیزی است که بالا تعریف کردید
            models.UniqueConstraint(
                fields=['user', 'line'],
                name='unique_user_line_membership'
            )
        ]

    def __str__(self):
        return f"{self.user} - {self.line}"


class StaffLine(BaseModel):
    staff = models.ForeignKey(
        Staff,
        on_delete=models.CASCADE,
        related_name="line_memberships",
    )
    line = models.ForeignKey(
        Line,
        on_delete=models.CASCADE,
        related_name="staff_memberships",
    )

    class Meta:
        constraints = [
            # اینجا هم نام فیلدها باید دقیق باشد
            models.UniqueConstraint(
                fields=['staff', 'line'],
                name='unique_staff_line'
            )
        ]

    def __str__(self):
        return f"{self.staff} - {self.line}"

class Media(BaseModel):
    content = models.ForeignKey(
        "Content",
        on_delete=models.CASCADE,
        related_name="media",
        null=True,
        blank=True,
    )
    text = models.TextField(
        blank=True,
    )

    file = models.FileField(
        upload_to="medias/%Y/%m/%d/",
        blank=True,
        null=True,
    )

    def __str__(self):
        return f"Media #{self.pk}"



class Assignment(BaseModel):
    line = models.ForeignKey(
        Line,
        on_delete=models.CASCADE,
        related_name="assignments",
    )

    title = models.CharField(
        max_length=255,
    )

    description = models.TextField(
        blank=True,
    )

    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="children",
    )

    def __str__(self):
        return self.title



class AssignmentMedia(BaseModel):
    assignment = models.ForeignKey(
        Assignment,
        on_delete=models.CASCADE,
        related_name="media_items",
    )

    media = models.ForeignKey(
        Media,
        on_delete=models.CASCADE,
        related_name="assignments",
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["assignment", "media"],
                name="unique_assignment_media",
            )
        ]


class AssignmentRecipient(BaseModel):
    member = models.ForeignKey(
        LineMember,
        on_delete=models.CASCADE,
        related_name="assignment_recipients",
    )

    assignment = models.ForeignKey(
        Assignment,
        on_delete=models.CASCADE,
        related_name="recipients",
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["assignment", "member"],
                name="unique_assignment_recipient",
            )
        ]

    def __str__(self):
        return f"{self.assignment} -> {self.member}"





class AssignmentSubmission(BaseModel):
    assignment_recipient = models.OneToOneField(
        AssignmentRecipient,
        on_delete=models.CASCADE,
        related_name="submission",
    )

    def __str__(self):
        return f"Submission #{self.pk}"





class SubmissionMedia(BaseModel):
    submission = models.ForeignKey(
        AssignmentSubmission,
        on_delete=models.CASCADE,
        related_name="media_items",
    )

    media = models.ForeignKey(
        Media,
        on_delete=models.CASCADE,
        related_name="submissions",
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["submission", "media"],
                name="unique_submission_media",
            )
        ]



class Conversation(BaseModel):
    line = models.ForeignKey(
        Line,
        on_delete=models.CASCADE,
        related_name="conversations",
    )

    def __str__(self):
        return f"Conversation #{self.pk}"


class ConversationParticipant(BaseModel):
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name="participants",
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="conversation_participations",
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["conversation", "user"],
                name="unique_conversation_participant",
            )
        ]

    def __str__(self):
        return f"{self.conversation} - {self.user}"



class Message(BaseModel):
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name="messages",
    )

    sender = models.ForeignKey(
        ConversationParticipant,
        on_delete=models.PROTECT,
        related_name="sent_messages",
    )

    media = models.ForeignKey(
        Media,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="messages",
    )

    def __str__(self):
        return f"Message #{self.pk}"





class ConsultationForm(BaseModel):
    line = models.OneToOneField(
        Line,
        on_delete=models.CASCADE,
        related_name="consultation_form",
    )
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True,null=True)
    file = models.FileField()

    def __str__(self):
        return f"Consultation Form - {self.line}"




class Appointment(BaseModel):
    line = models.ForeignKey(
        Line,
        on_delete=models.CASCADE,
        related_name="appointments",
    )

    member = models.ForeignKey(
        LineMember,
        on_delete=models.CASCADE,
        related_name="appointments",
    )

    staff = models.ForeignKey(
        Staff,
        on_delete=models.CASCADE,
        related_name="appointments",
    )

    status = models.CharField(
        max_length=255,
    )

    appointment_time = models.DateTimeField()

    def __str__(self):
        return f"Appointment #{self.pk}"



class Feature(BaseModel):
    line = models.ForeignKey(
        Line,
        on_delete=models.CASCADE,
        related_name="features",
    )

    title = models.CharField(
        max_length=255,
        blank=True,
    )

    text = models.TextField(
        blank=True,
    )

    media = models.ForeignKey(
        Media,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="features",
    )

    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="children",
    )

    def __str__(self):
        return self.title or f"Feature #{self.pk}"



class Content(BaseModel):
    line = models.ForeignKey(
        Line,
        on_delete=models.CASCADE,
        related_name="contents",
    )

    title = models.CharField(
        max_length=255,
        blank=True,
    )

    text = models.TextField(
        blank=True,
    )

    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="children",
    )

    def __str__(self):
        return self.title or f"Content #{self.pk}"


class ContentRecipient(BaseModel):
    content = models.ForeignKey(
        Content,
        on_delete=models.CASCADE,
        related_name="recipients",
    )

    member = models.ForeignKey(
        LineMember,
        on_delete=models.CASCADE,
        related_name="content_recipients",
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["content", "member"],
                name="unique_content_recipient",
            )
        ]

    def __str__(self):
        return f"{self.content} -> {self.member}"

