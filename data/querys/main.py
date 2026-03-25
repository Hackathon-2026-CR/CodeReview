from fastapi import FastAPI
from data.querys.router import router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title='CodeReview')



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
