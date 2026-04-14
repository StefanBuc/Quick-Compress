import os
from fastapi import FastAPI
from app.routes.upload import router as upload_router
from app.routes.download import router as download_router
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

origins = os.getenv("ALLOWED_ORIGINS", "*")

if origins == "*":
    allow_origins = ["*"]
else:
    allow_origins = [origin.strip() for origin in origins.split(",")]

app = FastAPI()


app.include_router(upload_router)
app.include_router(download_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}