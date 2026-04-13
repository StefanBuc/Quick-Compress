from fastapi import APIRouter, File, Form, HTTPException, UploadFile
import uuid
from pathlib import Path
from pathvalidate import sanitize_filename
from app.services.video import process_video


router = APIRouter(prefix="/api/upload", tags=["upload"])
upload_path = Path(__file__).resolve().parent.parent.parent / "uploads"

@router.post("/uploadfile/")
async def upload_file(file: UploadFile = File(description="A mp4 video file to upload."), target_size_mb: float = Form(8.0)):
    unique_id = uuid.uuid4()
    upload_path.mkdir(exist_ok=True)
    
    if file.filename:
        filename = str(unique_id) + "_" + sanitize_filename(file.filename)
    else:
        raise HTTPException(status_code=400, detail="Filename is required")
    
    with open(upload_path / filename, "wb") as buffer:
        while chunk := await file.read(1024 * 1024):
            buffer.write(chunk)
    
    try:
        output_path = process_video(upload_path / filename, target_size_mb)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
    return {"filename": filename,
            "compressed_filename": output_path.name,
            "target_size_mb": target_size_mb
            }