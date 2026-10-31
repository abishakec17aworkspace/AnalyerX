
import pandas as pd
import numpy as np


def Data_Cleaning_Output(df: pd.DataFrame):

    cleaned_df = df.copy()

    cleaning_report = []

    # 1. Standardize column names
    original_columns = list(cleaned_df.columns)

    cleaned_df.columns = (
        cleaned_df.columns
        .str.strip()
        .str.lower()
        .str.replace(" ", "_", regex=False)
        .str.replace(r"[^a-zA-Z0-9_]", "", regex=True)
    )

    if original_columns != list(cleaned_df.columns):
        cleaning_report.append(
            "Column names standardized"
        )

    # 2. Remove exact duplicate rows
    duplicate_count = int(cleaned_df.duplicated().sum())

    if duplicate_count > 0:

        cleaned_df = cleaned_df.drop_duplicates()

        cleaning_report.append(
            f"Removed {duplicate_count} duplicate rows"
        )

    # 3. Handle missing values
    missing_before = cleaned_df.isnull().sum().to_dict()

    missing_report = {}

    for column in cleaned_df.columns:

        missing_count = int(
            cleaned_df[column].isnull().sum()
        )

        if missing_count == 0:
            continue

        if pd.api.types.is_numeric_dtype(cleaned_df[column]):

            cleaned_df[column] = cleaned_df[column].fillna(
                cleaned_df[column].median()
            )

            missing_report[column] = (
                f"Filled {missing_count} missing values with median"
            )

        else:

            cleaned_df[column] = cleaned_df[column].fillna(
                "Unknown"
            )

            missing_report[column] = (
                f"Filled {missing_count} missing values with Unknown"
            )

    if missing_report:
        cleaning_report.append("Missing values handled")

    # 4. Convert data types
    dtype_changes = {}

    for column in cleaned_df.columns:

        original_dtype = str(cleaned_df[column].dtype)

        if cleaned_df[column].dtype == "object":

            converted = pd.to_numeric(
                cleaned_df[column],
                errors="coerce"
            )

            non_missing = cleaned_df[column].notna()

            if (
                non_missing.sum() > 0
                and converted[non_missing].notna().all()
            ):

                cleaned_df[column] = converted

        new_dtype = str(cleaned_df[column].dtype)

        if original_dtype != new_dtype:

            dtype_changes[column] = (
                f"{original_dtype} → {new_dtype}"
            )

    if dtype_changes:
        cleaning_report.append("Data types corrected")

    # 5. Cleaning summary
    missing_after = cleaned_df.isnull().sum().to_dict()

    summary = {

        "original_rows": int(len(df)),

        "cleaned_rows": int(len(cleaned_df)),

        "original_columns": int(len(df.columns)),

        "cleaned_columns": int(len(cleaned_df.columns)),

        "duplicates_removed": duplicate_count,

        "missing_values_before": {
            column: int(count)
            for column, count in missing_before.items()
        },

        "missing_values_after": {
            column: int(count)
            for column, count in missing_after.items()
        },

        "dtype_changes": dtype_changes,

        "cleaning_operations": cleaning_report
    }

    return {

        "cleaning_summary": summary,

        "cleaned_data": (
            cleaned_df.astype(object)
            .where(pd.notna(cleaned_df), None)
            .to_dict(orient="records")
        )
    }
