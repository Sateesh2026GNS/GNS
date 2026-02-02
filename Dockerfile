# Python-only Dockerfile for FastAPI backend
# NOTE: Frontend static assets should be built in CI and placed at Backend/frontend/dist
FROM python:3.11-slim

WORKDIR /app

# Install OS packages required for building any python wheels (if needed)
RUN apt-get update \
    && apt-get install -y --no-install-recommends build-essential ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code (including prebuilt frontend assets in frontend/dist if present)
COPY . .

ENV PORT=8080
EXPOSE 8080

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]