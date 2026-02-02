# --- STAGE 1: Build the React Frontend ---
FROM node:20-slim AS build-stage
WORKDIR /frontend
# Copy only package files first for better caching
COPY Frontend/package*.json ./
RUN npm install
# Copy the rest of the frontend code and build it
COPY Frontend/ .
RUN npm run build

# --- STAGE 2: Run the FastAPI Backend ---
FROM python:3.11-slim
WORKDIR /app

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY . .

# Copy the built React files from the first stage
# (Adjust 'frontend/dist' to 'frontend/build' depending on if you use Vite or Create React App)
COPY --from=build-stage /frontend/dist /app/frontend/dist

ENV PORT=8080
EXPOSE 8080

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]