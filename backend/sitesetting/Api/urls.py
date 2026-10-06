from django.urls import path
from .views import (
    BackgroundMusicView,
    ContactRequestCreateView,
    ContactRequestDetailView,
    ContactRequestListView,
    SliderDetailView,
    SliderImageCreateView,
    SliderImageDetailView,
    SliderListCreateView,
    SliderPublicView,
)

urlpatterns = [
    path('contact/', ContactRequestCreateView.as_view(), name='contact-create'),
    path('contact/list/', ContactRequestListView.as_view(), name='contact-list'),
    path('contact/<int:pk>/', ContactRequestDetailView.as_view(), name='contact-detail'),
    path(
        "background-music/",
        BackgroundMusicView.as_view(),
        name="background-music"
    ),

    # اسلایدر (عمومی)
    path("sliders/public/<slug:key>/", SliderPublicView.as_view(), name="slider-public"),

    # اسلایدر (مدیریتی)
    path("sliders/", SliderListCreateView.as_view(), name="slider-list"),
    path("sliders/<uuid:pk>/", SliderDetailView.as_view(), name="slider-detail"),
    path(
        "sliders/<uuid:slider_id>/images/",
        SliderImageCreateView.as_view(),
        name="slider-image-create",
    ),
    path(
        "sliders/images/<uuid:pk>/",
        SliderImageDetailView.as_view(),
        name="slider-image-detail",
    ),
]
