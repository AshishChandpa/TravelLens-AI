from flask import Flask, render_template, request, jsonify
from webapp.helper.speech_text import text_to_speech, speech_to_text, process_query_with_openai
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
    data = request.json
    text = data.get("text")
    if not text:
        return jsonify({"error": "No text provided"}), 400

    # Step 1: Process the query with OpenAI
    openai_response = process_query_with_openai(text)

    # Step 2: Speak the OpenAI response using Azure TTS
    tts_result = text_to_speech(openai_response)

    return jsonify({
        "message": tts_result,
        "openai_response": openai_response
    })

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