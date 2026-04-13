from fastapi import FastAPI
from app.routes.upload import router as upload_router
from app.routes.download import router as download_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.include_router(upload_router)
app.include_router(download_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}