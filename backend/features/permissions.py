from rest_framework.permissions import BasePermission, IsAuthenticated


class IsAuthor(BasePermission):
    """Allow access only to the author of the object.

    Implies IsAuthenticated — anonymous users are rejected before
    the object-level check runs.
    """

    def has_permission(self, request, view):
        return IsAuthenticated().has_permission(request, view)

    def has_object_permission(self, request, view, obj):
        return obj.author_id is not None and obj.author_id == request.user.id
