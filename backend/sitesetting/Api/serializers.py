from rest_framework import serializers
from sitesetting.models import (
    BackgroundMusic,
    ContactRequest,
    Slider,
    SliderImage,
)


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
    
    
class SliderImagePublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = SliderImage
        fields = ["id", "image", "caption_title", "caption_text", "order"]


class SliderPublicSerializer(serializers.ModelSerializer):
    images = SliderImagePublicSerializer(many=True, read_only=True)

    class Meta:
        model = Slider
        fields = ["key", "title", "interval_seconds", "images"]


class SliderImageAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = SliderImage
        fields = [
            "id",
            "slider",
            "image",
            "caption_title",
            "caption_text",
            "order",
            "is_active",
        ]
        read_only_fields = ["id", "slider"]
        extra_kwargs = {"image": {"required": False}}

    def validate(self, attrs):
        # هنگام ساخت، عکس اجباری است؛ هنگام ویرایش می‌تواند ارسال نشود
        if self.instance is None and not attrs.get("image"):
            raise serializers.ValidationError({"image": "انتخاب عکس الزامی است."})
        return attrs


class SliderAdminSerializer(serializers.ModelSerializer):
    images = SliderImageAdminSerializer(many=True, read_only=True)

    class Meta:
        model = Slider
        fields = [
            "id",
            "key",
            "title",
            "is_active",
            "start_at",
            "end_at",
            "interval_seconds",
            "images",
        ]
        read_only_fields = ["id"]

    def validate(self, attrs):
        start = attrs.get("start_at", getattr(self.instance, "start_at", None))
        end = attrs.get("end_at", getattr(self.instance, "end_at", None))

        if start and end and end <= start:
            raise serializers.ValidationError(
                {"end_at": "زمان پایان باید بعد از زمان شروع باشد."}
            )

        interval = attrs.get(
            "interval_seconds", getattr(self.instance, "interval_seconds", 5)
        )
        if interval < 1:
            raise serializers.ValidationError(
                {"interval_seconds": "فاصله‌ی تعویض باید حداقل ۱ ثانیه باشد."}
            )

        return attrs