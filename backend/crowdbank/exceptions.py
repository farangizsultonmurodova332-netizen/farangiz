import logging
from rest_framework.views import exception_handler
from rest_framework.exceptions import ValidationError, NotFound, PermissionDenied
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """
    Custom exception handler for DRF that provides consistent error responses.
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)

    # Log the exception
    if response is None:
        # Unhandled exception
        logger.error(
            f"Unhandled exception: {exc.__class__.__name__}: {str(exc)}",
            exc_info=True,
            extra={'context': context}
        )
    else:
        logger.warning(
            f"Handled exception: {exc.__class__.__name__}: {str(exc)}",
            extra={'context': context, 'status_code': response.status_code}
        )

    # Customize the response format
    if response is not None:
        custom_response_data = {
            'success': False,
            'error': {
                'type': exc.__class__.__name__,
                'message': get_error_message(exc, response.data),
                'details': format_error_details(response.data),
                'status_code': response.status_code
            }
        }
        response.data = custom_response_data

    # Handle Django ObjectDoesNotExist
    elif isinstance(exc, ObjectDoesNotExist):
        custom_response_data = {
            'success': False,
            'error': {
                'type': 'NotFound',
                'message': 'The requested resource was not found.',
                'details': str(exc),
                'status_code': status.HTTP_404_NOT_FOUND
            }
        }
        response = Response(custom_response_data, status=status.HTTP_404_NOT_FOUND)

    # Handle generic exceptions
    else:
        custom_response_data = {
            'success': False,
            'error': {
                'type': 'ServerError',
                'message': 'An unexpected error occurred. Please try again later.',
                'details': str(exc), # Always show error for debugging
                'status_code': status.HTTP_500_INTERNAL_SERVER_ERROR
            }
        }
        response = Response(custom_response_data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return response


def get_error_message(exc, data):
    """Extract a user-friendly error message from the exception."""
    if isinstance(exc, ValidationError):
        return "Validation error. Please check your input."
    elif isinstance(exc, NotFound):
        return "The requested resource was not found."
    elif isinstance(exc, PermissionDenied):
        return "You do not have permission to perform this action."
    elif hasattr(exc, 'detail'):
        if isinstance(exc.detail, dict):
            # Get first error message from dict
            first_key = next(iter(exc.detail))
            first_error = exc.detail[first_key]
            if isinstance(first_error, list):
                return str(first_error[0])
            return str(first_error)
        return str(exc.detail)
    return "An error occurred while processing your request."


def format_error_details(data):
    """Format error details in a consistent structure."""
    if isinstance(data, dict):
        # Handle DRF validation errors
        formatted = {}
        for field, errors in data.items():
            if isinstance(errors, list):
                formatted[field] = [str(error) for error in errors]
            else:
                formatted[field] = str(errors)
        return formatted
    elif isinstance(data, list):
        return [str(error) for error in data]
    return str(data)
