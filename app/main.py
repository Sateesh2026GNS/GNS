from fastapi import FastAPI
from app.api.v1.routes import router as v1_router

app = FastAPI(title="LogicPuse API (FastAPI)")
app.include_router(v1_router)


@app.get("/")
async def root():
    return {"message": "Welcome to LogicPuse API (FastAPI)", "version": "1.0.0"}
