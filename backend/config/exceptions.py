from rest_framework.exceptions import NotAuthenticated
from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        return None

    if isinstance(exc, NotAuthenticated):
        response.status_code = 401

    if isinstance(response.data, dict):
        detail = response.data.pop("detail", "An error occurred.")
        field_errors = {k: v for k, v in response.data.items()}
        body = {"detail": str(detail)}
        if field_errors:
            body["field_errors"] = field_errors
    elif isinstance(response.data, list):
        body = {"detail": response.data[0] if response.data else "An error occurred."}
    else:
        body = {"detail": str(response.data)}

    response.data = body
    return response
