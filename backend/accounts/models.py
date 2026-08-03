import os

from django.contrib.auth.models import AbstractUser
from django.db import models

from core.models import BaseModel


# Create your models here.


def user_avatar_upload_path(instance, filename):
    ext = os.path.splitext(filename)[1]

    return f"users/{instance.id}/avatar/avatar{ext}"


def information_upload_path(instance, filename):
    ext = os.path.splitext(filename)[1]

    return f"informations/{instance.id}/{filename}"


from django.utils import timezone
from datetime import timedelta


class OTPCode(BaseModel):

    phone_number = models.CharField(
        max_length=20,
        db_index=True,
    )

    code = models.CharField(
        max_length=6,
    )

    is_used = models.BooleanField(
        default=False,
        db_index=True,
    )

    expires_at = models.DateTimeField()

    class Meta:
        indexes = [
            models.Index(fields=["phone_number", "is_used"]),
        ]

    def is_expired(self):
        return timezone.now() >= self.expires_at

class Information(BaseModel):
    title = models.CharField(max_length=150)

    text = models.TextField(
        blank=True
    )

    file = models.FileField(
        upload_to=information_upload_path,
        blank=True,
        null=True
    )

    parent = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="children"
    )

    def __str__(self):
        return self.title

class Address(BaseModel):
    country = models.CharField(max_length=100)
    province = models.CharField(max_length=100)
    city = models.CharField(max_length=100)

    street = models.CharField(max_length=255)
    postal_code = models.CharField(max_length=20, blank=True)

    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.country} - {self.city}"


class Club(BaseModel):
    name = models.CharField(max_length=150)

    address = models.ForeignKey(
        Address,
        on_delete=models.PROTECT,
        related_name="clubs"
    )

    def __str__(self):
        return self.name


class User(AbstractUser):

    phone_number = models.CharField(
        max_length=20,
        blank=True
    )

    land_line = models.CharField(
        max_length=20,
        blank=True
    )

    is_student = models.BooleanField(
        default=False
    )

    degree = models.CharField(
        max_length=100,
        blank=True
    )

    job = models.CharField(
        max_length=100,
        blank=True
    )

    sport_discipline = models.CharField(
        max_length=100,
        blank=True
    )

    professional_background = models.TextField(
        blank=True
    )

    referral_code = models.CharField(
        max_length=100,
        blank=True
    )

    address = models.ForeignKey(
        Address,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="users"
    )

    club = models.ForeignKey(
        Club,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="members"
    )

    informations = models.ManyToManyField(
        Information,
        blank=True,
        related_name="users"
    )

    avatar = models.ImageField(
        upload_to=user_avatar_upload_path,
        blank=True,
        null=True
    )

    bio = models.TextField(
        blank=True
    )

    birth_date = models.DateField(
        blank=True,
        null=True
    )

    def __str__(self):
        return self.get_full_name() or self.username



class Staff(BaseModel):
    user = models.OneToOneField('User', on_delete=models.CASCADE)
    employee_code = models.CharField(
        max_length=50,
        unique=True
    )

    hire_date = models.DateField()

    position = models.CharField(
        max_length=100
    )



class UserRole(BaseModel):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="user_roles"
    )

    role = models.ForeignKey(
        'Role',
        on_delete=models.CASCADE,
        related_name="users"
    )

    class Meta:
        unique_together = (
            "user",
            "role",
        )

class Role(BaseModel):
    name = models.CharField(
        max_length=100,
        unique=True
    )

    description = models.TextField(
        blank=True
    )

    def __str__(self):
        return self.name