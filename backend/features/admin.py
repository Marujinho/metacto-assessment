from django.contrib import admin

from .models import FeatureRequest, Vote


class VoteInline(admin.TabularInline):
    model = Vote
    extra = 0
    readonly_fields = ("user", "created_at")


@admin.register(FeatureRequest)
class FeatureRequestAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "slug",
        "author",
        "status",
        "vote_count",
        "created_at",
        "deleted_at",
    )
    list_filter = ("status", "created_at")
    search_fields = ("title", "title_normalized", "description")
    readonly_fields = ("title_normalized", "slug", "vote_count", "created_at", "updated_at")
    prepopulated_fields = {}
    inlines = [VoteInline]

    def get_queryset(self, request):
        return FeatureRequest.all_objects.all()


@admin.register(Vote)
class VoteAdmin(admin.ModelAdmin):
    list_display = ("user", "feature_request", "created_at")
    list_filter = ("created_at",)
    raw_id_fields = ("user", "feature_request")
