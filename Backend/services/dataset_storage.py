
import pandas as pd
from uuid import uuid4


# ==========================================
# DATASET STORAGE
# ==========================================

datasets: dict[str, pd.DataFrame] = {}

cleaned_datasets: dict[str, pd.DataFrame] = {}


# ==========================================
# STORE ORIGINAL DATASET
# ==========================================

def store_dataset(df: pd.DataFrame) -> str:

    dataset_id = str(uuid4())

    datasets[dataset_id] = df.copy(deep=True)

    return dataset_id


# ==========================================
# GET ORIGINAL DATASET
# ==========================================

def get_dataset(dataset_id: str) -> pd.DataFrame:

    if dataset_id not in datasets:
        raise KeyError("Original dataset not found")

    return datasets[dataset_id].copy(deep=True)


# ==========================================
# STORE CLEANED DATASET
# ==========================================

def store_cleaned_dataset(
    dataset_id: str,
    df: pd.DataFrame
) -> None:

    if dataset_id not in datasets:
        raise KeyError("Original dataset not found")

    cleaned_datasets[dataset_id] = df.copy(deep=True)


# ==========================================
# GET CLEANED DATASET
# ==========================================

def get_cleaned_dataset(dataset_id: str) -> pd.DataFrame:

    if dataset_id not in cleaned_datasets:
        raise KeyError("Cleaned dataset not found")

    return cleaned_datasets[dataset_id].copy(deep=True)
