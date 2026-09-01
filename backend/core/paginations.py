from collections import OrderedDict

from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class DefaultPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100

    page_query_param = "page"

    def get_paginated_response(self, data):
        return Response(
            OrderedDict(
                [
                    (
                        "pagination",
                        {
                            "count": self.page.paginator.count,
                            "page": self.page.number,
                            "page_size": self.get_page_size(self.request),
                            "pages": self.page.paginator.num_pages,
                            "has_next": self.page.has_next(),
                            "has_previous": self.page.has_previous(),
                            "next": self.get_next_link(),
                            "previous": self.get_previous_link(),
                        },
                    ),
                    ("results", data),
                ]
            )
        )
