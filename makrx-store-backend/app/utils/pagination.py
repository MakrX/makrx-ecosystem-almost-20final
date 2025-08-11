from typing import Optional
from sqlalchemy.orm import Query


def paginate_query(
    query: Query,
    *,
    page: Optional[int] = None,
    per_page: Optional[int] = None,
    offset: Optional[int] = None,
    limit: Optional[int] = None,
):
    """Apply pagination to a SQLAlchemy query.

    Either ``page`` and ``per_page`` or ``offset`` and ``limit`` must be
    provided. Returns the list of items after applying the pagination.
    """
    if page is not None and per_page is not None:
        offset_value = (page - 1) * per_page
        limit_value = per_page
    elif offset is not None and limit is not None:
        offset_value = offset
        limit_value = limit
    else:
        raise ValueError("Must provide page/per_page or offset/limit for pagination")

    return query.offset(offset_value).limit(limit_value).all()
