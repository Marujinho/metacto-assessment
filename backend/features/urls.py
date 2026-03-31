from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register("features", views.FeatureRequestViewSet, basename="feature")

urlpatterns = [
    path("", include(router.urls)),
    path(
        "features/<slug:slug>/vote/",
        views.VoteView.as_view(),
        name="feature-vote",
    ),
]
