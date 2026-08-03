from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response

from accounts.Api.v1.serializer import PasswordLoginSerializer


def get_tokens_for_user(user):

    refresh = RefreshToken.for_user(user)

    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }



class LoginView(APIView):

    def post(self, request):

        serializer = PasswordLoginSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        user = serializer.validated_data["user"]


        tokens = get_tokens_for_user(user)


        response = Response({
            "access": tokens["access"]
        })


        response.set_cookie(
            key="refresh_token",
            value=tokens["refresh"],
            httponly=True,
            secure=False, # True در production
            samesite="Lax",
            max_age=7*24*60*60
        )


        return response


class RefreshTokenView(APIView):

    def post(self, request):

        refresh_token = request.COOKIES.get(
            "refresh_token"
        )


        if not refresh_token:
            raise AuthenticationFailed(
                "Refresh token وجود ندارد"
            )


        try:

            refresh = RefreshToken(
                refresh_token
            )

            access = str(
                refresh.access_token
            )


            return Response({
                "access": access
            })


        except Exception:

            raise AuthenticationFailed(
                "Refresh token نامعتبر است"
            )


class VerifyTokenView(APIView):

    authentication_classes = [
        JWTAuthentication
    ]

    permission_classes = [
        IsAuthenticated
    ]


    def get(self, request):

        return Response({
            "valid": True,
            "user": {
                "id": request.user.id,
                "username": request.user.username,
            }
        })


class LogoutView(APIView):

    def post(self, request):

        response = Response({
            "message": "Logged out"
        })

        response.delete_cookie(
            "refresh_token"
        )

        return response