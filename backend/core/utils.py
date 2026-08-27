from django_redis import get_redis_connection

def invalidate_user_cache(user_id):
    redis = get_redis_connection("default")

    patterns = [
        f"user:{user_id}:my-lines:*",
    ]

    for pattern in patterns:
        keys = list(redis.scan_iter(match=pattern))

        if keys:
            redis.delete(*keys)


def invalidate_all_my_lines_cache():
    redis = get_redis_connection("default")

    keys = list(
        redis.scan_iter(
            match="user:*:my-lines:*"
        )
    )

    if keys:
        redis.delete(*keys)