from fastapi import FastAPI

app = FastAPI(title="CENAT Page Builder API")

@app.get("/health")
def health():
    return {"status": "ok"}
