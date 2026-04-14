from pathlib import Path
import time

def cleanup_old_files():
    uploads_dir = Path(__file__).resolve().parent.parent.parent / "uploads"
    now = time.time()
    cutoff = now - (60 * 60)

    print("Starting cleanup of old files...")

    for file in uploads_dir.iterdir():
        if file.is_file() and file.stat().st_mtime < cutoff:
            try:
                file.unlink()
                print(f"Deleted old file: {file.name}")
            except Exception as e:
                print(f"Error deleting file {file.name}: {e}")

if __name__ == "__main__":
    cleanup_old_files()