import pandas as pd
from fastapi import APIRouter, UploadFile,File

router = APIRouter(
    prefix="/Upload",
    tags=["upload"]
)

# @router.post("/")
# async def uploaded_dataset( dataset : UploadFile=File(...)):
#     df = pd.read_csv(dataset.file)
#     return {
#         "message":" CSV Recived Sucessfully....",
#         "FileName ":dataset.File,
#         "row ":len(df),

#     }

@router.post("/")
async def upload_dataset(dataset: UploadFile = File(...)):

    df = pd.read_csv(dataset.file)

    return {
        "message": "CSV uploaded successfully",
        "filename": dataset.filename,
        "rows": len(df),
        "columns": list(df.columns)
    }