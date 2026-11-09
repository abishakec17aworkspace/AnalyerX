
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from services.dataset_export import export_cleaned_dataset


router = APIRouter(
    prefix="/Export",
    tags=["Export"]
)


@router.get("/{dataset_id}")
def download_cleaned_dataset(dataset_id: str):

    try:

        file_path = export_cleaned_dataset(dataset_id)

        return FileResponse(

            path=file_path,

            media_type="text/csv",

            filename="cleaned_dataset.csv"

        )

    except KeyError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error)
        )

    except Exception as error:

        print("EXPORT ERROR:", repr(error))

        raise HTTPException(
            status_code=500,
            detail="Unable to export cleaned dataset."
        )
