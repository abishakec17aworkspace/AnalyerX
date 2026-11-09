
import pandas as pd


def convert_to_json_safe(df: pd.DataFrame):
    safe_df = df.astype(object).where(pd.notna(df), None)
    return safe_df.to_dict(orient="records")


def cleaned_dataset_output(
    original_df: pd.DataFrame,
    cleaned_df: pd.DataFrame,
    preview_rows: int = 10
):

    original_rows, original_columns = original_df.shape
    cleaned_rows, cleaned_columns = cleaned_df.shape

    missing_before = int(original_df.isna().sum().sum())
    missing_after = int(cleaned_df.isna().sum().sum())

    duplicates_before = int(original_df.duplicated().sum())
    duplicates_after = int(cleaned_df.duplicated().sum())

    column_information = []

    for column in cleaned_df.columns:
        column_information.append({
            "column_name": str(column),
            "datatype": str(cleaned_df[column].dtype),
            "missing_values": int(cleaned_df[column].isna().sum())
        })

    preview = {
        "preview_rows": min(preview_rows, cleaned_rows),
        "total_rows": cleaned_rows,
        "columns": [str(column) for column in cleaned_df.columns],
        "data": convert_to_json_safe(
            cleaned_df.head(preview_rows)
        )
    }

    return {
        "cleaning_summary": {
            "original_rows": original_rows,
            "cleaned_rows": cleaned_rows,
            "original_columns": original_columns,
            "cleaned_columns": cleaned_columns,
            "rows_removed": original_rows - cleaned_rows,
            "duplicates_before": duplicates_before,
            "duplicates_after": duplicates_after,
            "duplicates_removed": max(
                0, duplicates_before - duplicates_after
            ),
            "missing_values_before": missing_before,
            "missing_values_after": missing_after,
            "missing_values_handled": missing_before - missing_after
        },

        "dataset_info": {
            "original_shape": list(original_df.shape),
            "cleaned_shape": list(cleaned_df.shape)
        },

        "column_information": column_information,

        "preview": preview,

        "complete_data": convert_to_json_safe(cleaned_df)
    }
