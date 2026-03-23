from fastapi import FastAPI
from router import router

app = FastAPI(title='CodeReview')

app.include_router(router)