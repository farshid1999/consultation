from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from sitesetting.models import ContactRequest, BackgroundMusic
from .serializers import ContactRequestSerializer, BackgroundMusicSerializer


class ContactRequestCreateView(generics.CreateAPIView):
    serializer_class = ContactRequestSerializer
    permission_classes = [permissions.AllowAny]


class ContactRequestListView(generics.ListAPIView):
    serializer_class = ContactRequestSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = ContactRequest.objects.all()


class ContactRequestDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = ContactRequestSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = ContactRequest.objects.all()


class BackgroundMusicView(APIView):

    def get(self, request):
        music = BackgroundMusic.objects.first()

        if not music:
            return Response(
                {"detail": "Background music not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = BackgroundMusicSerializer(
            music,
            context={"request": request}
        )

        return Response(serializer.data)

    def post(self, request):
        music = BackgroundMusic.objects.first()

        serializer = BackgroundMusicSerializer(
            instance=music,
            data=request.data,
            context={"request": request}
        )

        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_200_OK if music else status.HTTP_201_CREATED
        )