import orjson
from drf_standardized_errors.formatter import ExceptionFormatter
from drf_standardized_errors.types import Error, ErrorResponse


class MyExceptionFormatter(ExceptionFormatter):
    def format_error_response(self, error_response: ErrorResponse):
        if len(error_response.errors) == 1:
            field = (
                self.snake_to_camel(error_response.errors[0].attr)
                if error_response.errors[0].attr
                else "error"
            )

            return {field: self.format_error(error_response.type, error_response.errors[0])}

        return {
            self.snake_to_camel(error.attr): self.format_error(error_response.type, error)
            for error in error_response.errors
        }

    def format_error(self, error_type, error: Error):
        return {"type": error_type, "code": error.code, "detail": self.parse_json(error.detail)}

    @staticmethod
    def parse_json(string):
        try:
            return orjson.loads(string.replace("'", '"'))
        except orjson.JSONDecodeError:
            return string

    @staticmethod
    def snake_to_camel(s: str):
        return s[0] + s.title().replace("_", "")[1:]
