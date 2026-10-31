from uuid import uuid4
import pandas as pd

datasets:dict[str,pd.DataFrame]={}

def store_dataset(df:pd.DataFrame)->str:
    dataset_id = str(uuid4())

    datasets[dataset_id]=df.copy(deep=True)
    return dataset_id

def get_dataset(dataset_id:str)->pd.DataFrame:

    if dataset_id not in datasets:
      raise KeyError("Dataste not found in storage...")

    return datasets[dataset_id].copy(deep=True)

def update_dataset(dataset_id: str, df: pd.DataFrame) -> None:
    if dataset_id not in datasets:
        raise KeyError("Dataset not found. Upload the dataset again.")

    datasets[dataset_id] = df.copy(deep=True)