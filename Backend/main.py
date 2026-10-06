from fastapi import FastAPI,UploadFile,File
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    # title="Gaming Analytics API",
    # description="Backend for Gaming Revenue & Player Analytics Platform",
    # version="1.0.0"
    debug=False
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def home():
    return {
        "message : Analyzer is Started...."
    }

@app.get("/Health")
def health():
    return {
        "message : health func() " 
    }

@app.post("/")
async def upload_dataset(dataset: UploadFile = File(...)):
    return {
        "message": "CSV uploaded successfully",
        "filename": dataset.filename
    }