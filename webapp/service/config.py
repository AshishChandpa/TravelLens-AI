import os

import dotenv

dotenv.load_dotenv(".env", override=True)


class Config:
    FLASK_PORT = os.getenv("FLASK_PORT")
    PYTHON_ENV = os.getenv("PYTHON_ENV")
    AZURE_SPEECH_KEY = os.getenv("AZURE_SPEECH_KEY")
    AZURE_SPEECH_REGION = os.getenv("AZURE_SPEECH_REGION")
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

    def __init__(self) -> None:
        required_env_vars = [
            "PYTHON_ENV",
            "FLASK_PORT",
            "AZURE_SPEECH_KEY",
            "AZURE_SPEECH_REGION",
            "OPENAI_API_KEY"
        ]

        missing_vars = [
            env_var for env_var in required_env_vars if os.getenv(env_var) is None
        ]
        if missing_vars:
            msg = f"Missing environment variables: {', '.join(missing_vars)}"
            raise OSError(msg)
