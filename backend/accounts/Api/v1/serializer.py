import random
from datetime import timedelta

from django.contrib.auth.hashers import make_password, check_password
from django.db import transaction
from rest_framework import serializers

from accounts.models import (
    User,
    Staff,
    Address,
    Club,
    Information,
    Role,
    UserRole, OTPCode
)
from message.tasks import *

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = (
            "id",
            "name",
            "description",
        )


class RoleCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = (
            "id",
            "name",
            "description",
        )

class RoleUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = (
            "id",
            "name",
            "description",
        )

        read_only_fields = ("id",)

class StaffAssignRoleSerializer(serializers.Serializer):
    staff_id = serializers.PrimaryKeyRelatedField(
        queryset=Staff.objects.select_related("user")
    )

    roles = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(),
        many=True
    )

    @transaction.atomic
    def create(self, validated_data):
        staff = validated_data["staff_id"]
        roles = validated_data["roles"]

        created = []

        for role in roles:
            user_role, _ = UserRole.objects.get_or_create(
                user=staff.user,
                role=role
            )
            created.append(user_role)

        return created


class StaffRemoveRoleSerializer(serializers.Serializer):
    staff_id = serializers.PrimaryKeyRelatedField(
        queryset=Staff.objects.select_related("user")
    )

    roles = serializers.PrimaryKeyRelatedField(
        queryset=Role.objects.all(),
        many=True
    )

    @transaction.atomic
    def save(self, **kwargs):
        staff = self.validated_data["staff_id"]
        roles = self.validated_data["roles"]

        UserRole.objects.filter(
            user=staff.user,
            role__in=roles
        ).delete()

        return staff

class UserRoleSerializer(serializers.ModelSerializer):
    role = RoleSerializer(read_only=True)

    class Meta:
        model = UserRole
        fields = (
            "id",
            "role",
        )

class AddressSerializer(serializers.ModelSerializer):

    class Meta:
        model = Address
        fields = [
            "id",
            "country",
            "province",
            "city",
            "street",
            "postal_code",
            "description",
        ]


class InformationSerializer(serializers.ModelSerializer):
    children = serializers.SerializerMethodField()

    class Meta:
        model = Information
        fields = (
            "id",
            "title",
            "text",
            "file",
            "parent",
            "children",
        )

    def get_children(self, obj):
        return InformationSerializer(
            obj.children.all(),
            many=True,
            context=self.context,
        ).data



class InformationCreateSerializer(serializers.ModelSerializer):

    children = serializers.ListField(
        child=serializers.DictField(),
        required=False
    )


    class Meta:
        model = Information
        fields = [
            "title",
            "text",
            "file",
            "children"
        ]

    @transaction.atomic
    def create(self, validated_data):

        children = validated_data.pop(
            "children",
            []
        )


        information = Information.objects.create(
            **validated_data
        )


        for child in children:

            child_serializer = InformationCreateSerializer(
                data=child
            )

            child_serializer.is_valid(
                raise_exception=True
            )


            child_information = child_serializer.save()


            child_information.parent = information
            child_information.save()


        return information




class ClubSerializer(serializers.ModelSerializer):

    address = AddressSerializer()


    class Meta:
        model = Club
        fields = [
            "id",
            "name",
            "address"
        ]


    def create(self, validated_data):

        address_data = validated_data.pop(
            "address"
        )

        address = Address.objects.create(
            **address_data
        )

        return Club.objects.create(
            address=address,
            **validated_data
        )


class UserCreateSerializer(serializers.ModelSerializer):

    address = AddressSerializer(
        required=False
    )


    club = ClubSerializer(
        required=False
    )

    informations = InformationCreateSerializer(
        many=True,
        required=False
    )


    class Meta:

        model = User

        fields = [

            "id",

            "username",
            "password",

            "first_name",
            "last_name",
            "email",

            "phone_number",
            "land_line",

            "is_student",

            "degree",
            "job",

            "sport_discipline",

            "professional_background",

            "referral_code",


            "address",

            "club",


            "avatar",

            "bio",

            "birth_date",


            "informations",

        ]

        extra_kwargs = {

            "password":{
                "write_only":True
            }

        }

    @transaction.atomic
    def create(self, validated_data):


        address_data = validated_data.pop(
            "address",
            None
        )


        club_data = validated_data.pop(
            "club",
            None
        )

        informations = validated_data.pop(
            "informations",
            []
        )


        password = validated_data.pop(
            "password"
        )


        user = User.objects.create(
            **validated_data
        )


        user.set_password(password)

        user.save()



        if address_data:

            address = Address.objects.create(
                **address_data
            )

            user.address = address



        if club_data:

            club = ClubSerializer().create(club_data)


            user.club = club

        for info_data in informations:
            information = InformationCreateSerializer().create(
                info_data
            )

            user.informations.add(
                information
            )

        user.save()

        return user



class UserUpdateSerializer(serializers.ModelSerializer):

    address = AddressSerializer(
        required=False
    )

    club = ClubSerializer(
        required=False
    )

    informations = InformationCreateSerializer(
        many=True,
        required=False
    )


    class Meta:

        model = User

        fields = [

            "id",

            "username",
            "password",

            "first_name",
            "last_name",
            "email",

            "phone_number",
            "land_line",

            "is_student",

            "degree",
            "job",

            "sport_discipline",

            "professional_background",

            "referral_code",

            "address",
            "club",

            "avatar",
            "bio",

            "birth_date",

            "informations",

        ]


        extra_kwargs = {
            "password": {
                "write_only": True,
                "required": False
            }
        }


    @transaction.atomic
    def update(self, instance, validated_data):

        address_data = validated_data.pop(
            "address",
            None
        )

        club_data = validated_data.pop(
            "club",
            None
        )

        informations = validated_data.pop(
            "informations",
            None
        )


        password = validated_data.pop(
            "password",
            None
        )


        # update normal fields

        for attr, value in validated_data.items():

            setattr(
                instance,
                attr,
                value
            )


        if password:

            instance.set_password(
                password
            )


        instance.save()



        # update address

        if address_data:

            if instance.address:

                for attr, value in address_data.items():

                    setattr(
                        instance.address,
                        attr,
                        value
                    )

                instance.address.save()


            else:

                address = Address.objects.create(
                    **address_data
                )

                instance.address = address

                instance.save()



        # update club

        if club_data:

            club_address = club_data.pop(
                "address",
                None
            )


            if instance.club:

                for attr, value in club_data.items():

                    setattr(
                        instance.club,
                        attr,
                        value
                    )

                instance.club.save()


                if club_address:

                    for attr, value in club_address.items():

                        setattr(
                            instance.club.address,
                            attr,
                            value
                        )

                    instance.club.address.save()


            else:

                address = Address.objects.create(
                    **club_address
                )


                club = Club.objects.create(
                    address=address,
                    **club_data
                )


                instance.club = club

                instance.save()



        # replace informations

        if informations is not None:

            instance.informations.clear()


            for info_data in informations:

                information = InformationCreateSerializer().create(
                    info_data
                )

                instance.informations.add(
                    information
                )


        return instance



class StaffCreateSerializer(serializers.ModelSerializer):

    user = UserCreateSerializer()


    class Meta:

        model = Staff

        fields = [

            "id",
            "user",
            "employee_code",
            "hire_date",
            "position"

        ]

    @transaction.atomic
    def create(self, validated_data):

        user_data = validated_data.pop(
            "user"
        )


        user_serializer = UserCreateSerializer(
            data=user_data
        )


        user_serializer.is_valid(
            raise_exception=True
        )


        user = user_serializer.save()


        return Staff.objects.create(
            user=user,
            **validated_data
        )



class StaffUpdateSerializer(serializers.ModelSerializer):

    user = UserUpdateSerializer(
        required=False
    )


    class Meta:

        model = Staff

        fields = [

            "id",

            "user",

            "employee_code",

            "hire_date",

            "position"

        ]


    @transaction.atomic
    def update(self, instance, validated_data):

        user_data = validated_data.pop(
            "user",
            None
        )


        if user_data:

            user_serializer = UserUpdateSerializer(
                instance=instance.user,
                data=user_data,
                partial=True
            )

            user_serializer.is_valid(
                raise_exception=True
            )

            user_serializer.save()



        for attr, value in validated_data.items():

            setattr(
                instance,
                attr,
                value
            )


        instance.save()


        return instance


class UserListSerializer(serializers.ModelSerializer):
    club = serializers.CharField(source="club.name", read_only=True)
    address = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "is_student",
            "club",
            "address",
            "avatar",
        )

    def get_address(self, obj):
        if obj.address:
            return f"{obj.address.country} - {obj.address.city}"
        return None


class UserDetailSerializer(serializers.ModelSerializer):
    address = AddressSerializer(read_only=True)
    club = ClubSerializer(read_only=True)
    informations = InformationSerializer(many=True, read_only=True)


    class Meta:
        model = User
        exclude = (
            "password",
            "groups",
            "user_permissions",
        )


class StaffListSerializer(serializers.ModelSerializer):

    roles = UserRoleSerializer(
        source="user.user_roles",
        many=True,
        read_only=True,
    )
    user = UserListSerializer(
        read_only=True
    )

    class Meta:
        model = Staff
        fields = (
            "id",
            "employee_code",
            "position",
            "hire_date",
            "roles",
            "user"
        )


class StaffDetailSerializer(serializers.ModelSerializer):

    user = UserDetailSerializer(
        read_only=True
    )
    roles = UserRoleSerializer(
        source="user.user_roles",
        many=True,
        read_only=True,
    )

    class Meta:

        model = Staff

        fields = (
            "id",
            "employee_code",
            "position",
            "hire_date",
            "user",
            "roles"
        )


class RegisterSerializer(serializers.ModelSerializer):
    club = ClubSerializer()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = (
            "username",
            "password",
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "is_student",
            "degree",
            "job",
            "sport_discipline",
            "professional_background",
            "club",
        )

    @transaction.atomic
    def create(self, validated_data):
        club_data = validated_data.pop("club")
        address_data = club_data.pop("address")

        address = Address.objects.create(**address_data)

        club = Club.objects.create(
            address=address,
            **club_data
        )

        password = validated_data.pop("password")

        user = User(**validated_data)
        user.club = club
        user.set_password(password)
        user.save()

        return user


from django.contrib.auth import authenticate
from rest_framework import serializers


class PasswordLoginSerializer(serializers.Serializer):

    username = serializers.CharField()

    password = serializers.CharField(
        write_only=True
    )


    def validate(self, attrs):

        user = authenticate(
            username=attrs["username"],
            password=attrs["password"]
        )


        if not user:
            raise serializers.ValidationError(
                "نام کاربری یا رمز عبور اشتباه است"
            )


        attrs["user"] = user

        return attrs



class SendOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)

    def validate_phone_number(self, value):
        if not User.objects.filter(phone_number=value).exists():
            raise serializers.ValidationError(
                "کاربری با این شماره وجود ندارد."
            )

        cache_key = f"otp:cooldown:{value}"

        if cache.get(cache_key):
            raise serializers.ValidationError(
                "کد تایید قبلاً ارسال شده است. لطفاً دو دقیقه دیگر دوباره تلاش کنید."
            )

        return value

    def save(self, **kwargs):
        phone_number = self.validated_data["phone_number"]

        code = f"{random.randint(100000, 999999)}"

        expires_at = timezone.now() + timedelta(minutes=2)

        OTPCode.objects.filter(
            phone_number=phone_number,
            is_used=False,
        ).update(
            is_used=True,
        )

        OTPCode.objects.create(
            phone_number=phone_number,
            code=make_password(code),
            expires_at=expires_at,
        )

        cache.set(
            f"otp:cooldown:{phone_number}",
            True,
            timeout=120,
        )

        send_bulk_sms.delay(
            mobiles=[phone_number],
            message_text=f"کد تایید شما: {code}",
        )

        return {"phone_number": phone_number}




from django.utils import timezone, cache

class VerifyOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField(max_length=20)
    code = serializers.CharField(max_length=6)

    def validate(self, attrs):
        phone_number = attrs["phone_number"]
        code = attrs["code"]

        user = User.objects.filter(
            phone_number=phone_number
        ).first()

        if not user:
            raise serializers.ValidationError(
                "کاربری با این شماره وجود ندارد."
            )

        otp = (
            OTPCode.objects.filter(
                phone_number=phone_number,
                is_used=False,
            )
            .order_by("-created_at")
            .first()
        )

        if otp is None:
            raise serializers.ValidationError(
                "کد تاییدی برای این شماره وجود ندارد."
            )

        if otp.is_expired():
            raise serializers.ValidationError(
                "کد تایید منقضی شده است."
            )

        if not check_password(code, otp.code):
            raise serializers.ValidationError(
                "کد تایید اشتباه است."
            )

        otp.is_used = True
        otp.save(update_fields=["is_used"])

        attrs["user"] = user

        return attrs