from fastapi import FastAPI
from querys.router import router
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title='CodeReview')

app.include_router(router)

# Configure CORS for both local development and production
cors_origins = [
    "http://localhost:5173",  # React dev server
    "http://localhost:3000",  # Alternative local
]

# In production, add your frontend URL
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    cors_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)