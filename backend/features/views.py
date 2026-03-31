from django.db.models import BooleanField, Case, Value, When
from django.db.models.expressions import Exists, OuterRef
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import mixins, status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from .models import FeatureRequest, Vote
from .permissions import IsAuthor
from .serializers import (
    FeatureRequestSerializer,
    SimilarFeatureSerializer,
    VoteResponseSerializer,
)
from .services import VoteService


class FeatureRequestViewSet(
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.CreateModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    serializer_class = FeatureRequestSerializer
    lookup_field = "slug"

    def get_permissions(self):
        if self.action in ("list", "retrieve"):
            return [AllowAny()]
        if self.action in ("partial_update", "destroy"):
            return [IsAuthor()]
        return [IsAuthenticated()]

    def get_queryset(self):
        qs = FeatureRequest.objects.all()
        user = self.request.user

        if user.is_authenticated:
            qs = qs.annotate(
                has_voted=Exists(
                    Vote.objects.filter(
                        user=user, feature_request=OuterRef("pk")
                    )
                ),
                is_owner=Case(
                    When(author_id=user.id, then=Value(True)),
                    default=Value(False),
                    output_field=BooleanField(),
                ),
            )
        else:
            qs = qs.annotate(
                has_voted=Value(False, output_field=BooleanField()),
                is_owner=Value(False, output_field=BooleanField()),
            )

        sort = self.request.query_params.get("sort", "top")
        if sort == "newest":
            qs = qs.order_by("-created_at")
        else:
            qs = qs.order_by("-vote_count", "-created_at")

        status_filter = self.request.query_params.get("status")
        if status_filter:
            qs = qs.filter(status=status_filter)

        search = self.request.query_params.get("search")
        if search:
            normalized = FeatureRequest.normalize_title(search)
            qs = qs.filter(title_normalized__icontains=normalized)

        return qs

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        feature = serializer.instance
        normalized = FeatureRequest.normalize_title(feature.title)
        similar_qs = (
            FeatureRequest.objects.filter(title_normalized=normalized)
            .exclude(pk=feature.pk)
        )

        response_data = {"created": True, "feature": serializer.data}

        if similar_qs.exists():
            response_data["similar_features"] = SimilarFeatureSerializer(
                similar_qs[:5], many=True
            ).data
            return Response(response_data, status=status.HTTP_200_OK)

        return Response(response_data, status=status.HTTP_201_CREATED)

    http_method_names = ["get", "post", "patch", "delete", "head", "options"]

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.deleted_at = timezone.now()
        instance.save(update_fields=["deleted_at"])
        return Response(status=status.HTTP_204_NO_CONTENT)


class VoteView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "vote"

    def _get_feature(self, slug):
        return get_object_or_404(FeatureRequest, slug=slug)

    def _vote_response(self, feature, has_voted, http_status):
        feature.refresh_from_db(fields=["vote_count"])
        data = VoteResponseSerializer(
            {"vote_count": feature.vote_count, "has_voted": has_voted}
        ).data
        return Response(data, status=http_status)

    def post(self, request, slug):
        feature = self._get_feature(slug)
        try:
            VoteService.vote(user=request.user, feature_request=feature)
        except ValueError as e:
            return Response(
                {"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST
            )
        return self._vote_response(feature, True, status.HTTP_201_CREATED)

    def delete(self, request, slug):
        feature = self._get_feature(slug)
        try:
            VoteService.unvote(user=request.user, feature_request=feature)
        except ValueError as e:
            return Response(
                {"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST
            )
        return self._vote_response(feature, False, status.HTTP_200_OK)
