from flask import jsonify

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
