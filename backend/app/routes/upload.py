from fastapi import APIRouter, File, UploadFile
import uuid
from pathlib import Path
from pathvalidate import sanitize_filename

router = APIRouter(prefix="/api/upload", tags=["upload"])
upload_path = Path(__file__).parent.parent.parent / "uploads"

@router.post("/uploadfile/")
async def upload_file(file: UploadFile = File(description="A mp4 video file to upload.")):
    unique_id = uuid.uuid4()
    upload_path.mkdir(exist_ok=True)

    if file.filename:
        filename = str(unique_id) + "_" + sanitize_filename(file.filename)
    else:
        return {"error": "No filename provided."}
    
    with open(upload_path / filename, "wb") as buffer:
        while chunk := await file.read(1024 * 1024):
            buffer.write(chunk)

    print(f"Received file: {filename}")
    return {"filename": filename}