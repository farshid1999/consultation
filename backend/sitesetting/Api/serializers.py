from rest_framework import serializers
from sitesetting.models import ContactRequest


class ContactRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactRequest
        fields = [
            'id',
            'first_name',
            'last_name',
            'phone',
            'contact_type',
            'messenger_type',
            'email',
            'message',
            'is_read',
            'created_at',
        ]
        read_only_fields = ['id', 'is_read', 'created_at']

    def validate(self, data):
        if data.get('contact_type') == 'messenger' and not data.get('messenger_type'):
            raise serializers.ValidationError(
                {'messenger_type': 'انتخاب پیام‌رسان الزامی است'}
            )
        if data.get('contact_type') == 'email' and not data.get('email'):
            raise serializers.ValidationError(
                {'email': 'ایمیل الزامی است'}
            )
        return data