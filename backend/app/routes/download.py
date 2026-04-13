from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path

router = APIRouter(prefix="/api/download", tags=["download"])
download_path = Path(__file__).resolve().parent.parent.parent / "uploads"

@router.get("/file/{filename}")
def download_file(filename: str):
    file_path = download_path / filename
    
    if not file_path.resolve().is_relative_to(download_path.resolve()):
        raise HTTPException(status_code=400, detail="Invalid filename")
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(path=file_path, filename=filename, media_type="video/mp4")