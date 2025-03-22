import time


class RequestTimingMiddleware:
    def __init__(self, app) -> None:
        self.app = app

    def __call__(self, environ, start_response):
        start_time = time.time()

        def custom_start_response(status, headers, exc_info=None):
            duration = time.time() - start_time
            headers.append(("X-Request-Duration", str(duration)))
            return start_response(status, headers, exc_info)

        return self.app(environ, custom_start_response)
