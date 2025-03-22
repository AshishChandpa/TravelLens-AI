from flask import Flask, render_template, request, jsonify
from webapp.helper.speech_text import text_to_speech, speech_to_text
import os

from webapp import app
from webapp.helper import process_data
from webapp.model import SampleModel


@app.route("/sample", methods=["GET"])
def get_sample():
    """Sample route to return a JSON response using helper and model."""
    raw_data = "  Sample Data  "
    processed_data = process_data(raw_data)

    sample_model = SampleModel(name="Example", value=processed_data)

    return jsonify(
        {
            "message": "This is a sample route using helper and model!",
            "data": str(sample_model.name),
            "success": True,
        },
    ), 200

@app.route("/text-to-speech", methods=["POST"])
def tts():
    text = request.json.get("text")
    if not text:
        return jsonify({"error": "No text provided"}), 400
    result = text_to_speech(text)
    return jsonify({"message": result})

# Speech-to-Text endpoint
@app.route("/speech-to-text", methods=["POST"])
def stt():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400
    audio_file = request.files["file"]
    audio_path = os.path.join("static", "uploads", audio_file.filename)
    audio_file.save(audio_path)
    result = speech_to_text(audio_path)
    return jsonify({"text": result})