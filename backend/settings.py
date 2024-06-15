import pathlib
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    API_V1: str = "/api/v1"
    GAME_FILE: pathlib.Path = "mock_lol_data.csv"


settings = Settings()
