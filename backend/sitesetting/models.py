import os
import uuid

from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Q
from django.utils import timezone

from core.models import BaseModel


class ContactRequest(models.Model):
    
    class ContactType(models.TextChoices):
        PHONE = 'phone', 'تلفنی'
        MESSENGER = 'messenger', 'پیام‌رسان'
        EMAIL = 'email', 'ایمیل'

    class MessengerType(models.TextChoices):
        WHATSAPP = 'whatsapp', 'واتساپ'
        TELEGRAM = 'telegram', 'تلگرام'
        EITAA = 'eitaa', 'ایتا'
        RUBIKA = 'rubika', 'روبیکا'
        BALE = 'bale', 'بله'

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    contact_type = models.CharField(max_length=20, choices=ContactType.choices)
    messenger_type = models.CharField(
        max_length=20,
        choices=MessengerType.choices,
        null=True,
        blank=True
    )
    email = models.EmailField(null=True, blank=True)
    message = models.TextField(null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.contact_type}"



class BackgroundMusic(BaseModel):
    music = models.FileField()
    is_active = models.BooleanField(default=True)


def slider_image_upload_path(instance, filename):
    ext = os.path.splitext(filename)[1].lower()
    return f"sliders/{uuid.uuid4().hex}{ext}"


class SliderQuerySet(models.QuerySet):
    def active_now(self):
        """اسلایدرهایی که فعال‌اند و الان داخل بازه‌ی زمانی‌شان هستیم."""
        now = timezone.now()
        return self.filter(is_active=True).filter(
            Q(start_at__isnull=True) | Q(start_at__lte=now),
            Q(end_at__isnull=True) | Q(end_at__gte=now),
        )


class Slider(BaseModel):
    # شناسه‌ی بخش در سایت، مثلاً "why-sports-psychology"
    # تا بعداً بتوان برای بخش‌های دیگر هم اسلایدر ساخت
    key = models.SlugField(max_length=100, unique=True)
    title = models.CharField(max_length=150, blank=True)

    is_active = models.BooleanField(default=True, db_index=True)

    # خالی بودن یعنی بدون محدودیت
    start_at = models.DateTimeField(null=True, blank=True)
    end_at = models.DateTimeField(null=True, blank=True)

    # فاصله‌ی تعویض خودکار عکس‌ها (ثانیه)
    interval_seconds = models.PositiveSmallIntegerField(default=5)

    objects = SliderQuerySet.as_manager()

    def clean(self):
        if self.start_at and self.end_at and self.end_at <= self.start_at:
            raise ValidationError("زمان پایان باید بعد از زمان شروع باشد.")

    def is_live(self):
        now = timezone.now()
        return (
            self.is_active
            and (self.start_at is None or self.start_at <= now)
            and (self.end_at is None or self.end_at >= now)
        )

    def __str__(self):
        return self.title or self.key


class SliderImage(BaseModel):
    slider = models.ForeignKey(
        Slider, on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to=slider_image_upload_path)

    # متنی که روی کارت پایین هر عکس نمایش داده می‌شود
    # (در طراحی فعلی: «آمار بالینی» و متن زیرش)
    caption_title = models.CharField(max_length=100, blank=True)
    caption_text = models.TextField(blank=True)

    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return f"{self.slider} #{self.order}"