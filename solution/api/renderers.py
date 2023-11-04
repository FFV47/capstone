from typing import Any, Mapping, Optional, Union

import orjson
from rest_framework.compat import parse_header_parameters
from rest_framework.renderers import JSONRenderer


class ORJSONRenderer(JSONRenderer):
    """
    Renderer which serializes to JSON.
    """

    media_type = "application/json"

    def get_indent(
        self,
        accepted_media_type: Optional[str] = None,
        renderer_context: Optional[Mapping[str, Any]] = None,
    ):
        if accepted_media_type:
            # If the media type looks like 'application/json; indent=4',
            # then pretty print the result.
            _, params = parse_header_parameters(accepted_media_type)
            try:
                return params["indent"]
            except (KeyError, ValueError, TypeError):
                pass

        # If 'indent' is provided in the context, then pretty print the result.
        # E.g. If we're being called by the BrowsableAPIRenderer.
        return renderer_context.get("indent", None)

    def render(
        self,
        data: Union[dict, None],
        accepted_media_type: Optional[str] = None,
        renderer_context: Optional[Mapping[str, Any]] = None,
    ) -> bytes:
        if data is None:
            return b""

        renderer_context = renderer_context or {}

        indent = self.get_indent(accepted_media_type, renderer_context)
        options = None
        if indent:
            options = orjson.OPT_INDENT_2

        ret = orjson.dumps(data, option=options)

        return ret
