from fastapi import FastAPI
from app.routes.upload import router as upload_router
from app.routes.download import router as download_router

app = FastAPI()


app.include_router(upload_router)
app.include_router(download_router)

@app.get("/health")
def health_check():
    return {"status": "ok"}