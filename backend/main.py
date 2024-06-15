import pandas as pd
import numpy as np
from fastapi import FastAPI, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from scalar_fastapi import get_scalar_api_reference
from settings import settings


# FastAPI app
app = FastAPI(docs_url=None, redoc_url=None)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
api_router = APIRouter(prefix=settings.API_V1)


@api_router.get("/stats")
def stats(pokemons: str):
    df = pd.read_csv(settings.GAME_FILE, header=0, sep=",")
    pokemons = pokemons.split(",")
    return [
        df[df["pokemon"] == pokemon].to_dict(orient="records") for pokemon in pokemons
    ]


@api_router.get("/pokemons")
def pokemons():
    df = pd.read_csv(settings.GAME_FILE, header=0, sep=",")
    return np.sort(df["pokemon"].unique()).tolist()


# include the API router
app.include_router(api_router)


# scalar API documentation
@app.get("/docs", include_in_schema=False)
async def scalar_html():
    return get_scalar_api_reference(
        openapi_url=app.openapi_url,
        title=app.title,
    )
