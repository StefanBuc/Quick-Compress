FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1

# install ffmpeg + cron
RUN apt-get update && apt-get install -y ffmpeg cron && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN echo "0 */12 * * * /usr/local/bin/python3 /app/app/utils/cleanup.py >> /var/log/cron.log 2>&1" > /etc/cron.d/cleanup

RUN chmod 0644 /etc/cron.d/cleanup

RUN crontab /etc/cron.d/cleanup

RUN touch /var/log/cron.log

EXPOSE 8000

CMD ["sh", "-c", "service cron start && uvicorn main:app --host 0.0.0.0 --port 8000"]