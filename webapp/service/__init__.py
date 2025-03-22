"""All the router will be imported here."""

from webapp.service import errors
from webapp.service.config import Config
from webapp.service.logger import logger

Config()

__all__ = [
    "Config",
    "logger",
    "errors",
]
