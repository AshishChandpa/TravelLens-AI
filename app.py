"""Application entry point."""

from flask import Flask, render_template, request, jsonify
from webapp import app, router
from webapp.middleware import RequestTimingMiddleware
from webapp.service import Config, logger

__all__ = ["router"]
port = Config.FLASK_PORT


app.wsgi_app = RequestTimingMiddleware(app.wsgi_app)


# @app.route("/", methods=["GET"])
# def server() -> str:
#     logger.info("🚀Server is running!!!🚀")
#     return "<H1>🚀 Hello, Welcome to <I>Python Flask</I>!!!🚀</H1>"

@app.route("/")
def home():
    return render_template("index.html")


if __name__ == "__main__":
    logger.info(f"🚀 Server is up and running! 🌐 Listening on {port} 🎉")
    app.run(host="127.0.0.1", port=port, debug=True)
