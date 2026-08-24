# accounts/tasks.py

import json
import http.client
import logging

from celery import shared_task
from django.conf import settings

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_bulk_sms(
    self,
    mobiles: list[str],
    message_text: str,
    line_number: int | None = None,
    send_datetime: str | None = None,
):
    """
    Send SMS using sms.ir bulk API.

    Args:
        mobiles: List of mobile numbers.
        message_text: SMS text.
        line_number: Sender lines number.
        send_datetime: ISO datetime string or None.
    """

    conn = http.client.HTTPSConnection("api.sms.ir")

    payload = {
        "lineNumber": line_number or settings.SMS_IR_LINE_NUMBER,
        "messageText": message_text,
        "mobiles": mobiles,
        "sendDateTime": send_datetime,
    }

    headers = {
        "X-API-KEY": settings.SMS_IR_API_KEY,
        "Content-Type": "application/json",
    }

    try:
        conn.request(
            "POST",
            "/v1/send/bulk",
            json.dumps(payload),
            headers,
        )

        response = conn.getresponse()
        body = response.read().decode("utf-8")

        logger.info(
            "SMS.IR response | status=%s body=%s",
            response.status,
            body,
        )

        if response.status >= 400:
            raise Exception(body)

        return json.loads(body)

    except Exception as exc:
        logger.exception("SMS sending failed")

        raise self.retry(exc=exc)

    finally:
        conn.close()


@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def send_like_to_like_sms(
    self,
    mobiles: list[str],
    message_texts: list[str],
    line_number: int | None = None,
    send_datetime: int | None = None,
):
    """
    Send different SMS text to different mobile numbers.

    Example:
        mobiles = [
            "09121234567",
            "09123456789",
        ]

        message_texts = [
            "کد تایید شما: 123456",
            "سفارش شما ثبت شد.",
        ]
    """

    if len(mobiles) != len(message_texts):
        raise ValueError(
            "mobiles and message_texts must have the same length."
        )

    if len(mobiles) > 100:
        raise ValueError(
            "Maximum 100 mobile numbers are allowed."
        )

    conn = http.client.HTTPSConnection("api.sms.ir")

    payload = {
        "lineNumber": line_number or settings.SMS_IR_LINE_NUMBER,
        "messageTexts": message_texts,
        "mobiles": mobiles,
        "sendDateTime": send_datetime,
    }

    headers = {
        "X-API-KEY": settings.SMS_IR_API_KEY,
        "Content-Type": "application/json",
    }

    try:
        conn.request(
            "POST",
            "/v1/send/likeToLike",
            json.dumps(payload),
            headers,
        )

        response = conn.getresponse()
        body = response.read().decode("utf-8")

        logger.info(
            "SMS.IR LikeToLike | status=%s body=%s",
            response.status,
            body,
        )

        if response.status >= 400:
            raise Exception(body)

        result = json.loads(body)

        # status != 1 means request failed
        if result.get("status") != 1:
            raise Exception(result)

        return result

    except Exception as exc:
        logger.exception("LikeToLike SMS sending failed")
        raise self.retry(exc=exc)

    finally:
        conn.close()