"""Application entry point."""

from webapp import app, router
from webapp.middleware import RequestTimingMiddleware
from webapp.service import Config, logger

__all__ = ["router"]
port = Config.FLASK_PORT


app.wsgi_app = RequestTimingMiddleware(app.wsgi_app)


@app.route("/", methods=["GET"])
def server() -> str:
    logger.info("🚀Server is running!!!🚀")
    return "<H1>🚀 Hello, Welcome to <I>Python Flask</I>!!!🚀</H1>"


if __name__ == "__main__":
    logger.info(f"🚀 Server is up and running! 🌐 Listening on {port} 🎉")
    app.run(host="127.0.0.1", port=port, debug=True)
