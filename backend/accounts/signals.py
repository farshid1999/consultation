from django.db.models.signals import pre_delete, pre_save
from django.dispatch import receiver

from .models import Information, User


@receiver(pre_save, sender=Information)
def replace_information_file(sender, instance, **kwargs):

    if not instance.pk:
        return

    try:
        old = Information.objects.get(pk=instance.pk)
    except Information.DoesNotExist:
        return

    if old.file and old.file != instance.file:
        old.file.delete(save=False)


@receiver(pre_save, sender=User)
def replace_avatar(sender, instance, **kwargs):

    if not instance.pk:
        return

    try:
        old = User.objects.get(pk=instance.pk)
    except User.DoesNotExist:
        return

    if old.avatar and old.avatar != instance.avatar:
        old.avatar.delete(save=False)


@receiver(pre_delete, sender=Information)
def delete_information_file(sender, instance, **kwargs):
    if instance.file:
        instance.file.delete(save=False)


@receiver(pre_delete, sender=User)
def delete_avatar(sender, instance, **kwargs):
    if instance.avatar:
        instance.avatar.delete(save=False)
