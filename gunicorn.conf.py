import os

import dotenv

dotenv.load_dotenv(".env", override=True)

bind = "0.0.0.0:" + str(os.getenv("FLASK_PORT", 8080))
workers = int(os.getenv("GUNICORN_WORKERS", 2))
worker_class = "gthread"
threads = int(os.getenv("GUNICORN_THREADS", 2))
timeout = int(os.getenv("GUNICORN_TIMEOUT", 120))
graceful_timeout = int(os.getenv("GUNICORN_GRACEFUL_TIMEOUT", 30))
