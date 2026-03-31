from django.db import transaction
from django.db.models import F

from .models import FeatureRequest, Vote


class VoteService:
    """Single entry point for all vote operations.

    All callers (views, management commands, admin actions) must go through
    this service to guarantee consistency: self-vote prevention, unique vote
    enforcement, and atomic vote_count updates.
    """

    @staticmethod
    def vote(*, user, feature_request):
        if feature_request.author_id == user.id:
            raise ValueError("Cannot vote on your own feature request.")

        with transaction.atomic():
            vote, created = Vote.objects.get_or_create(
                user=user,
                feature_request=feature_request,
            )
            if not created:
                raise ValueError("Already voted on this feature request.")
            FeatureRequest.all_objects.filter(pk=feature_request.pk).update(
                vote_count=F("vote_count") + 1
            )

        return vote

    @staticmethod
    def unvote(*, user, feature_request):
        with transaction.atomic():
            deleted, _ = Vote.objects.filter(
                user=user,
                feature_request=feature_request,
            ).delete()
            if not deleted:
                raise ValueError("No vote to remove.")
            FeatureRequest.all_objects.filter(pk=feature_request.pk).update(
                vote_count=F("vote_count") - 1
            )
