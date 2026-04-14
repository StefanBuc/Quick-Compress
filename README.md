# Quick Compress

A fast, self-hosted video compression tool built with React, FastAPI, and FFmpeg.  
Supports GPU acceleration (NVENC) with automatic CPU fallback.

---

## Features

- Upload video files through a clean web UI
- Choose target file size (preset or custom)
- GPU-accelerated compression (NVIDIA NVENC)
- Automatic fallback to CPU if GPU is unavailable
- Download compressed videos instantly
- Automatic cleanup of old files (cron job)
- Fully Dockerized setup

---

## Preview

![QuickCompress UI](/docs/images/mainpage.png)

---

## Tech Stack

**Frontend**
- React (Vite + TypeScript)
- TailwindCSS

**Backend**
- FastAPI
- FFmpeg (video processing)

**Infrastructure**
- Docker & Docker Compose
- NVIDIA GPU support (NVENC)
- Cron (automatic file cleanup)

---

## How It Works

1. User uploads a video
2. Backend calculates required bitrate based on:
   - target file size
   - video duration
3. FFmpeg compresses using:
   - `h264_nvenc` (GPU) if available
   - `libx264` (CPU) as fallback
4. User downloads compressed file

---
## Environment Variables

The frontend uses environment variables to determine the backend API URL.

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:8001
```

---

### Notes

- If `VITE_API_URL` is not set, the app defaults to:

```
http://127.0.0.1:8001
```

---

### Production Example

When deploying, set your domain:

```env
VITE_API_URL=https://yourdomain.com
```

## Running with Docker

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/quickcompress.git
cd quickcompress
```

---

### 2. Build and start the containers

```bash
docker-compose up --build
```

This will:
- Build the frontend and backend images  
- Start both services  
- Enable video compression API  

---

### 3. Open the application

Frontend:  
http://localhost:5173  

Backend API:  
http://localhost:8000  
