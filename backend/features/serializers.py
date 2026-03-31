from rest_framework import serializers

from accounts.serializers import UserSerializer

from .models import FeatureRequest


class DuplicateOfSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeatureRequest
        fields = ("id", "slug", "title")
        read_only_fields = fields


class SimilarFeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeatureRequest
        fields = ("id", "slug", "title", "vote_count")
        read_only_fields = fields


class FeatureRequestSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    has_voted = serializers.BooleanField(read_only=True, default=False)
    is_owner = serializers.BooleanField(read_only=True, default=False)
    duplicate_of = DuplicateOfSerializer(read_only=True)

    class Meta:
        model = FeatureRequest
        fields = (
            "id",
            "slug",
            "title",
            "description",
            "author",
            "status",
            "vote_count",
            "has_voted",
            "is_owner",
            "duplicate_of",
            "created_at",
            "updated_at",
        )
        read_only_fields = (
            "id",
            "slug",
            "author",
            "status",
            "vote_count",
            "has_voted",
            "is_owner",
            "duplicate_of",
            "created_at",
            "updated_at",
        )

    def validate_title(self, value):
        if len(value) < 5:
            raise serializers.ValidationError(
                "Title must be at least 5 characters."
            )
        return value

    def validate_description(self, value):
        if len(value) < 20:
            raise serializers.ValidationError(
                "Description must be at least 20 characters."
            )
        return value


class FeatureRequestCreateResponseSerializer(serializers.Serializer):
    created = serializers.BooleanField()
    feature = FeatureRequestSerializer()
    similar_features = SimilarFeatureSerializer(many=True, required=False)


class VoteResponseSerializer(serializers.Serializer):
    vote_count = serializers.IntegerField()
    has_voted = serializers.BooleanField()
