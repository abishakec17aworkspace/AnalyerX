import pandas as pd
from fastapi import APIRouter, UploadFile,File,HTTPException
from services.DataOverview import Data_Overview_Output

router = APIRouter(
    prefix="/Upload",
    tags=["upload"]
)

@router.post("/")
async def upload_dataset(dataset: UploadFile = File(...)):

    if not dataset.filename.endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Only CSV Files are avvcepted"
        )
    
    try:
        df = pd.read_csv(dataset.file)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=f"there ia an error....: {str(e)}"
        )

    overView = Data_Overview_Output(df)

    return {
        "message": "CSV uploaded successfully",
        "filename": dataset.filename,
        "rows": len(df),
        "overview":overView
    }