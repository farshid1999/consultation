from rest_framework import serializers
from sitesetting.models import ContactRequest, BackgroundMusic


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


class BackgroundMusicSerializer(serializers.ModelSerializer):
    class Meta:
        model = BackgroundMusic
        fields = ["id", "is_active", "music"]

    def create(self, validated_data):
        instance = BackgroundMusic.objects.first()

        if instance:
            return self.update(instance, validated_data)

        return BackgroundMusic.objects.create(**validated_data)

    def update(self, instance, validated_data):
        new_music = validated_data.get("music")

        if new_music:
            if instance.music:
                instance.music.delete(save=False)

            instance.music = new_music

        if "is_active" in validated_data:
            instance.is_active = validated_data["is_active"]

        instance.save()

        return instance