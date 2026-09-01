# core/mixins.py
#
# Shared with StaffCreateAPIView. Extracting this here avoids copy-pasting
# the same _inject_files walker into every view that accepts nested
# multipart data (Content, Assignment, ConsultationForm, etc. will all
# need this same shim wherever a FileField sits inside a nested
# serializer).

import json

from rest_framework.response import Response


class NestedMultipartCreateMixin:
    """
    Mix into any generics.CreateAPIView (or GenericAPIView with a custom
    post) whose serializer contains nested objects/files. Expects the
    frontend to send either:
      - plain JSON (no files), or
      - multipart/form-data with a single "data" field holding the JSON
        payload (files replaced by "__FILE__N" placeholder strings) plus
        the real files attached under their bracket-notation path keys,
        matching services/api/formData.ts's buildFormData().
    """

    def _parse_payload(self, request):
        if "data" in request.data:
            payload = json.loads(request.data["data"])
            self._inject_files(payload, request.FILES, "")
            return payload
        return request.data

    def _inject_files(self, obj, files_dict, path):
        if isinstance(obj, dict):
            for key, value in obj.items():
                new_path = f"{path}[{key}]" if path else key
                if (
                    isinstance(value, str)
                    and value.startswith("__FILE__")
                    and new_path in files_dict
                ):
                    obj[key] = files_dict[new_path]
                else:
                    self._inject_files(value, files_dict, new_path)
        elif isinstance(obj, list):
            for i, item in enumerate(obj):
                self._inject_files(item, files_dict, f"{path}[{i}]")

    def create(self, request, *args, **kwargs):
        payload = self._parse_payload(request)
        serializer = self.get_serializer(data=payload)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return self._create_response(serializer, headers)

    def _create_response(self, serializer, headers):
        from rest_framework import status
        from rest_framework.response import Response

        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    # --- Update / Partial Update (جدید) ---

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        payload = self._parse_payload(request)
        serializer = self.get_serializer(instance, data=payload, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, "_prefetched_objects_cache", None):
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return self.update(request, *args, **kwargs)