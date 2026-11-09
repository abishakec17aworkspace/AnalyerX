
import pandas as pd

from fastapi import APIRouter, UploadFile, File, HTTPException

from services.dataset_storage import store_dataset

# Import your existing overview function here.
# IMPORTANT: Change this import to match your actual overview module.
from services.DataOverview import Data_Overview_Output


router = APIRouter(
    prefix="/Upload",
    tags=["Upload"]
)


@router.post("/")
async def upload_dataset(dataset: UploadFile = File(...)):

    try:

        # 1. Validate uploaded file
        if not dataset.filename.lower().endswith(".csv"):
            raise HTTPException(
                status_code=400,
                detail="Only CSV files are supported."
            )

        # 2. Read CSV file
        df = pd.read_csv(dataset.file)

        if df.empty:
            raise HTTPException(
                status_code=400,
                detail="Uploaded CSV file is empty."
            )

        # 3. Store original DataFrame
        dataset_id = store_dataset(df)

        # 4. Generate existing dataset overview
        overview = Data_Overview_Output(df)

        # 5. Return upload response
        return {
            "success": True,
            "message": "CSV uploaded successfully",
            "filename": dataset.filename,
            "rows": len(df),
            "dataset_id": dataset_id,
            "overview": overview
        }

    except HTTPException:
        raise

    except Exception as error:

        print("UPLOAD ERROR:", repr(error))

        raise HTTPException(
            status_code=500,
            detail="Unable to upload and analyze the CSV file."
        )

    finally:
        await dataset.close()
