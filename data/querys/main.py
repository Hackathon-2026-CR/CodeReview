from fastapi import FastAPI
from data.querys.router import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title='CodeReview')

app.include_router(router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)