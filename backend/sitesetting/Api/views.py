from rest_framework import generics, permissions
from sitesetting.models import ContactRequest
from .serializers import ContactRequestSerializer


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