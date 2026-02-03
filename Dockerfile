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

# Normalize frontend build output: if CI placed the SPA in `frontend/build`,
# rename it to `frontend/dist` so FastAPI's static route finds it consistently.
RUN if [ -d "frontend/build" ] && [ ! -d "frontend/dist" ]; then mv frontend/build frontend/dist; fi

# Warn at build time if no frontend build artifacts are present
RUN if [ ! -d "frontend/dist" ]; then echo "WARNING: frontend/dist not found - backend will serve API only"; fi

ENV PORT=8080
EXPOSE 8080

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]