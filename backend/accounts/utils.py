import random
from datetime import timedelta
from django.utils import timezone

from accounts.models import OTPCode


def create_otp(phone):

    code = random.randint(
        100000,
        999999
    )


    otp = OTPCode.objects.create(

        phone_number=phone,

        code=code,

        expires_at=
        timezone.now()
        +
        timedelta(minutes=2)

    )


    return otp