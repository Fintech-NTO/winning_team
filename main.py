from fastapi import FastAPI
from routers import rates

app = FastAPI()

app.include_router(rates.router)
