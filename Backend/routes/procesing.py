
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Any

from services.dataset_storage import (
    get_dataset,
    store_cleaned_dataset
)

from services.data_processing import process_dataset
from services.cleaned_dataset_output import cleaned_dataset_output

# ==========================================
# ROUTER CONFIGURATION
# ==========================================

router = APIRouter(
    prefix="/Processing",
    tags=["Processing"]
)


# ==========================================
# REQUEST MODEL
# ==========================================

class CleaningRequest(BaseModel):
    dataset_id: str

    missing_rules: dict[str, str] = Field(
        default_factory=dict
    )

    custom_values: dict[str, Any] = Field(
        default_factory=dict
    )

    remove_duplicates: bool = True

    normalize_columns: bool = True


# ==========================================
# DATA CLEANING API
# ==========================================

@router.post("/")
def apply_cleaning(request: CleaningRequest):

    try:

        # 1. Retrieve original dataset
        original_df = get_dataset(request.dataset_id)

        # 2. Apply cleaning operations
        cleaned_df = process_dataset(
            original_df=original_df,
            missing_rules=request.missing_rules,
            custom_values=request.custom_values,
            remove_duplicates=request.remove_duplicates,
            normalize_columns=request.normalize_columns
        )

        # 3. Store cleaned dataset
        store_cleaned_dataset(
            request.dataset_id,
            cleaned_df
        )

        # 4. Generate cleaning report
        cleaned_output = cleaned_dataset_output(
            original_df=original_df,
            cleaned_df=cleaned_df
        )

        # 5. Return response to frontend
        return {
            "success": True,
            "message": "Dataset cleaned successfully",
            "dataset_id": request.dataset_id,
            "cleaned_output": cleaned_output
        }

    except KeyError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error)
        )

    except (ValueError, TypeError) as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except Exception as error:

        print("PROCESSING ERROR:", repr(error))

        raise HTTPException(
            status_code=500,
            detail="Internal error while processing dataset."
        )
