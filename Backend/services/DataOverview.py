import pandas as pd


def Data_Overview_Output(df: pd.DataFrame):

    initial_rows = len(df)
    initial_col = len(df.columns)

    org_col_name = list(df.columns)

    # Normalize column names
    df.columns = df.columns.str.lower().str.strip()

    # Data types
    data_types = {
        column: str(dtype)
        for column, dtype in df.dtypes.items()
    }

    # Missing values
    missing_values = {
        column: int(value)
        for column, value in df.isnull().sum().items()
    }

    # -----------------------------
    # JSON SAFE PREVIEW
    # -----------------------------

    preview_df = df.head(4).copy()

    # Convert columns to object so None can replace NaN
    preview_df = preview_df.astype(object)

    # Replace NaN with None
    preview_df = preview_df.where(
        pd.notna(preview_df),
        None
    )

    preview = preview_df.to_dict(orient="records")

    return {
        "initial_data": {
            "initial_row": initial_rows,
            "initial_col": initial_col,
            "org_col_name": org_col_name
        },

        "normalized_data": {
            "column_name": list(df.columns)
        },

        "data_type": data_types,

        "missing_values": missing_values,

        "Preview": preview
    }