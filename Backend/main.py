
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.Upload import router as uploader_route
from routes.procesing import router as processing_router
from routes.export import router as export_router


# ==========================================
# FASTAPI APPLICATION
# ==========================================

app = FastAPI(
    title="Analyxer X API",
    description="Dataset Upload, Cleaning and Export API",
    version="1.0.0",
    debug=False
)


# ==========================================
# CORS CONFIGURATION
# ==========================================

app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"]
)


# ==========================================
# HOME ROUTE
# ==========================================

@app.get("/")
def home():

    return {
        "message": "Analyxer X is Started"
    }


# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/Health")
def health():

    return {
        "message": "Health check successful",
        "status": "Running"
    }


# ==========================================
# REGISTER API ROUTERS
# ==========================================

app.include_router(uploader_route)

app.include_router(processing_router)

app.include_router(export_router)
