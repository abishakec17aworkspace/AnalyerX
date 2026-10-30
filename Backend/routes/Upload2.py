
import io

import pandas as pd
from fastapi import APIRouter, File, HTTPException, UploadFile
from pandas.errors import EmptyDataError, ParserError

from services.dataset_storage import store_dataset
from services.DataOverview import Data_Overview_Output


router = APIRouter(
    prefix="/api/dataset",
    tags=["Dataset"]
)


@router.post("/Upload")
async def upload_dataset(file: UploadFile = File(...)):

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No filename was provided."
        )

    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are supported."
        )

    try:
        content = await file.read()

        if not content:
            raise HTTPException(
                status_code=400,
                detail="The uploaded file is empty."
            )

        # Basic upload limit: 10 MiB.
        if len(content) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=413,
                detail="The file exceeds the 10 MiB limit."
            )

        df = pd.read_csv(io.BytesIO(content))

        if len(df.columns) == 0:
            raise HTTPException(
                status_code=400,
                detail="The CSV file has no columns."
            )

        if df.columns.duplicated().any():
            raise HTTPException(
                status_code=400,
                detail="The CSV contains duplicate column names."
            )

        dataset_id = store_dataset(df)
        overview = Data_Overview_Output(df)

        return {
            "message": "CSV uploaded successfully.",
            "dataset_id": dataset_id,
            "filename": file.filename,
            "overview": overview
        }

    except HTTPException:
        raise

    except EmptyDataError:
        raise HTTPException(
            status_code=400,
            detail="The CSV contains no readable data."
        )

    except ParserError:
        raise HTTPException(
            status_code=400,
            detail="The CSV format could not be parsed."
        )

    except UnicodeDecodeError:
        raise HTTPException(
            status_code=400,
            detail="The CSV encoding is not supported."
        )

    finally:
        await file.close()
