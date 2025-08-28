from rest_framework.permissions import BasePermission

def _is_authed_with_role(request, role: str) -> bool:
    return bool(
        request.user
        and request.user.is_authenticated
        and (
            getattr(request.user, "role", None) == role
            or (role == "admin" and request.user.is_superuser)  # superuser counts as admin
        )
    )

class IsStudent(BasePermission):
    message = "Student role required."
    def has_permission(self, request, view):
        return _is_authed_with_role(request, "student")

class IsFaculty(BasePermission):
    message = "Faculty role required."
    def has_permission(self, request, view):
        return _is_authed_with_role(request, "faculty")

class IsAdminRole(BasePermission):
    message = "Admin role required."
    def has_permission(self, request, view):
        return _is_authed_with_role(request, "admin")
