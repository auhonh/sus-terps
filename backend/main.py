from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"notice": "Backend is up and running"}