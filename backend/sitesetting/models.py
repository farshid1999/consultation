from django.db import models

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
