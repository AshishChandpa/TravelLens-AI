"""Import test setup operations here."""

import dotenv
import pytest

from webapp import app as flask_app

dotenv.load_dotenv(".env", override=True)


@pytest.fixture(scope="session", autouse=True)
def setup_database() -> None:
    """Set up the test database."""


@pytest.fixture()
def db_session() -> None:
    """Provide a transactional scope around a series of operations."""


@pytest.fixture()
def client(app):
    """Provide a test client for the application."""
    return app.test_client()


@pytest.fixture()
def app():
    return flask_app
