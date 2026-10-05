from django.db.models import Prefetch
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView

from sitesetting.models import (
    BackgroundMusic,
    ContactRequest,
    Slider,
    SliderImage,
)
from .serializers import (
    BackgroundMusicSerializer,
    ContactRequestSerializer,
    SliderAdminSerializer,
    SliderImageAdminSerializer,
    SliderPublicSerializer,
)


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
        
# ── عمومی ─────────────────────────────────────────────────────────────────────


class SliderPublicView(generics.RetrieveAPIView):
    """فقط اسلایدر فعالِ داخل بازه‌ی زمانی؛ در غیر این صورت ۴۰۴."""

    serializer_class = SliderPublicSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "key"

    def get_queryset(self):
        return Slider.objects.active_now().prefetch_related(
            Prefetch(
                "images",
                queryset=SliderImage.objects.filter(is_active=True),
            )
        )


# ── مدیریتی ───────────────────────────────────────────────────────────────────


class SliderListCreateView(generics.ListCreateAPIView):
    serializer_class = SliderAdminSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Slider.objects.prefetch_related("images").order_by("-created_at")


class SliderDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SliderAdminSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = Slider.objects.prefetch_related("images")


class SliderImageCreateView(generics.CreateAPIView):
    serializer_class = SliderImageAdminSerializer
    permission_classes = [permissions.IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        slider = get_object_or_404(Slider, pk=self.kwargs["slider_id"])
        serializer.save(slider=slider)


class SliderImageDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SliderImageAdminSerializer
    permission_classes = [permissions.IsAdminUser]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    queryset = SliderImage.objects.all()

    def perform_update(self, serializer):
        old_file = serializer.instance.image
        new_file = self.request.FILES.get("image")
        if new_file and old_file:
            old_file.delete(save=False)  # فایل قبلی از دیسک پاک شود
        serializer.save()

    def perform_destroy(self, instance):
        if instance.image:
            instance.image.delete(save=False)
        instance.delete()