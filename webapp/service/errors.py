"""Error Handler."""

import threading

from flask import g, jsonify, request

from webapp import app


@app.before_request
def before_request() -> None:
    g.request_id = threading.current_thread().ident
    g.endpoint = request.endpoint


@app.errorhandler(400)
def bad_request(e):
    response = {
        "error": "Bad Request",
        "message": f"{e.description}",
        "success": False,
    }
    return jsonify(response), 400


@app.errorhandler(422)
def unprocessable_entity(e):
    response = {
        "error": "Unprocessable Entity",
        "message": f"{e.description}",
        "success": False,
    }
    return jsonify(response), 422


@app.errorhandler(404)
def page_not_found(e):
    response = {
        "error": "Not Found",
        "message": f"{e.description}",
        "success": False,
    }
    return jsonify(response), 404


@app.errorhandler(401)
def unauthorized(e):
    response = {
        "error": "Unauthorized",
        "message": f"{e.description}",
        "success": False,
    }
    return jsonify(response), 401


@app.errorhandler(500)
def internal_server_error(e):
    response = {
        "error": "Internal Server Error",
        "message": f"{e.description}",
        "success": False,
    }
    return jsonify(response), 500


@app.errorhandler(405)
def method_not_allowed(e):
    response = {
        "error": "Method Not Allowed",
        "message": f"{e.description}",
        "success": False,
    }
    return jsonify(response), 405
