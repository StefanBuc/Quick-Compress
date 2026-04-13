import subprocess
from pathlib import Path

def get_video_duration(filepath: Path) -> float:
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(filepath)],
        capture_output=True,
        text=True
    )
    
    if result.returncode != 0:
        raise RuntimeError(f"ffprobe error: {result.stderr}")
    
    output = result.stdout.strip()
    
    if not output:
        raise ValueError("Could not retrieve video duration.")
    
    return float(output)

def calculate_bitrate(file_size_mb: float, duration_sec: float) -> int:
    if duration_sec <= 0:
        raise ValueError("Invalid video duration")
    
    file_size_bits = file_size_mb * 8 * 1024 * 1024
    audio_bitrate_bps = 128 * 1024
    bitrate = file_size_bits / duration_sec
    video_bitrate = bitrate - audio_bitrate_bps
    
    if video_bitrate <= 0:
        raise ValueError("Target size too small for this video")
    
    return int(video_bitrate)

def compress_video(input_path: Path, output_path: Path, target_bitrate: int) -> Path:
    bitrate_kbps = target_bitrate // 1000
    
    result = subprocess.run(
        ["ffmpeg", "-y", "-i", str(input_path), "-c:v", "libx264", "-b:v", f"{bitrate_kbps}k", "-b:a", "128k", str(output_path)],
        capture_output=True,
        text=True
    )
    
    if result.returncode != 0:
        raise RuntimeError(f"ffmpeg error: {result.stderr}")
    
    input_path.unlink()
    
    return output_path

def process_video(input_path: Path, target_size_mb: float) -> Path:
    duration = get_video_duration(input_path)
    target_bitrate = calculate_bitrate(target_size_mb, duration)
    output_path = input_path.parent / f"compressed_{str(target_size_mb).replace('.', '_')}MB_{input_path.name}"
    
    return compress_video(input_path, output_path, target_bitrate)