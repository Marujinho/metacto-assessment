import re
import unicodedata

from django.conf import settings
from django.core.validators import MaxLengthValidator
from django.db import models
from django.utils.text import slugify


class ActiveManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(deleted_at__isnull=True)


class FeatureRequest(models.Model):

    class Status(models.TextChoices):
        OPEN = "open", "Open"
        PLANNED = "planned", "Planned"
        IN_PROGRESS = "in_progress", "In Progress"
        COMPLETED = "completed", "Completed"
        DECLINED = "declined", "Declined"

    title = models.CharField(max_length=120)
    title_normalized = models.CharField(
        max_length=120, db_index=True, editable=False
    )
    slug = models.SlugField(max_length=140, unique=True)
    description = models.TextField(validators=[MaxLengthValidator(2000)])
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name="feature_requests",
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.OPEN,
        db_index=True,
    )
    vote_count = models.PositiveIntegerField(default=0)
    duplicate_of = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="duplicates",
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    deleted_at = models.DateTimeField(null=True, blank=True, default=None)

    objects = ActiveManager()
    all_objects = models.Manager()

    class Meta:
        db_table = "feature_requests"
        ordering = ["-vote_count", "-created_at"]
        indexes = [
            models.Index(
                fields=["-vote_count", "-created_at"], name="idx_ranking"
            ),
            models.Index(fields=["-created_at"], name="idx_newest"),
            models.Index(fields=["author"], name="idx_author"),
            models.Index(fields=["status"], name="idx_status"),
        ]

    def save(self, *args, **kwargs):
        self.title_normalized = self.normalize_title(self.title)
        if not self.slug:
            base = slugify(self.title)[:120] or "feature"
            slug, n = base, 1
            while (
                FeatureRequest.all_objects.filter(slug=slug)
                .exclude(pk=self.pk)
                .exists()
            ):
                slug = f"{base}-{n}"
                n += 1
            self.slug = slug
        super().save(*args, **kwargs)

    @staticmethod
    def normalize_title(title: str) -> str:
        title = unicodedata.normalize("NFKD", title).lower().strip()
        title = re.sub(r"[^a-z0-9\s]", "", title)
        return re.sub(r"\s+", " ", title)

    def __str__(self):
        return self.title


class Vote(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="votes",
    )
    feature_request = models.ForeignKey(
        FeatureRequest,
        on_delete=models.CASCADE,
        related_name="votes",
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "votes"
        constraints = [
            models.UniqueConstraint(
                fields=["user", "feature_request"],
                name="unique_vote_per_user_feature",
            ),
        ]
        indexes = [
            models.Index(fields=["feature_request"], name="idx_vote_feature"),
            models.Index(fields=["user"], name="idx_vote_user"),
        ]

    def __str__(self):
        return f"{self.user} -> {self.feature_request}"
