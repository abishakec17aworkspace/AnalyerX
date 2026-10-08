import pandas as pd


def Data_Overview_Output(df: pd.DataFrame):

    # ==========================================
    # 1. INITIAL DATA
    # ==========================================

    initial_rows = len(df)

    initial_col = len(df.columns)

    org_col_name = list(df.columns)


    # ==========================================
    # 2. NORMALIZE COLUMN NAMES
    # ==========================================

    normalize_col = (
        df.columns
        .str.lower()
        .str.strip()
        .str.replace(" ", "_", regex=False)
    )

    overview_df = df.copy()

    overview_df.columns = normalize_col


    # ==========================================
    # 3. DATA TYPES
    # ==========================================

    data_types = {
        column: str(dtype)
        for column, dtype in overview_df.dtypes.items()
    }


    # ==========================================
    # 4. MISSING VALUES - COLUMN WISE
    # ==========================================

    missing_values = {
        column: int(value)
        for column, value
        in overview_df.isnull().sum().items()
    }


    # ==========================================
    # 5. TOTAL NULL VALUES
    # ==========================================

    total_null_value = int(
        overview_df.isnull().sum().sum()
    )


    # ==========================================
    # 6. TOTAL CELL COUNT
    # ==========================================

    total_cell_value = (
        initial_rows * initial_col
    )


    # ==========================================
    # 7. NULL PERCENTAGE
    # ==========================================

    if total_cell_value > 0:

        null_percentage = round(
            (total_null_value / total_cell_value) * 100,
            2
        )

    else:

        null_percentage = 0


    # ==========================================
    # 8. DUPLICATE COUNT
    # ==========================================

    duplicate_count = int(
        overview_df.duplicated().sum()
    )


    # ==========================================
    # 9. DUPLICATE PERCENTAGE
    # ==========================================

    if initial_rows > 0:

        duplicate_percentage = round(
            (duplicate_count / initial_rows) * 100,
            2
        )

    else:

        duplicate_percentage = 0


    # ==========================================
    # 10. COLUMN INFORMATION
    # ==========================================

    column_information = []

    for index, original_column in enumerate(org_col_name):

        normalized_column = overview_df.columns[index]

        column_information.append({

            "column_name": original_column,

            "normalized_column_name": normalized_column,

            "datatype": data_types[normalized_column],

            "missing_value": missing_values[normalized_column]

        })


    # ==========================================
    # 11. PREVIEW
    # ==========================================

    preview_df = overview_df.head(4).copy()

    preview_df = preview_df.astype(object)

    preview_df = preview_df.where(
        pd.notna(preview_df),
        None
    )

    preview = preview_df.to_dict(
        orient="records"
    )


    # ==========================================
    # 12. DESCRIBE
    # ==========================================

    describe_df = overview_df.describe(
        include="all"
    )

    describe_df = (
        describe_df
        .astype(object)
        .where(
            pd.notna(describe_df),
            None
        )
    )

    describe_data = describe_df.to_dict()


    # ==========================================
    # 13. FINAL RESPONSE
    # ==========================================

    return {

        # --------------------------------------
        # Initial Dataset
        # --------------------------------------

        "initial_data": {

            "initial_row": initial_rows,

            "initial_col": initial_col,

            "org_col_name": org_col_name

        },


        # --------------------------------------
        # Normalized Dataset
        # --------------------------------------

        "normalized_data": {

            "column_name":
                list(overview_df.columns)

        },


        # --------------------------------------
        # Dataset Size
        # --------------------------------------

        "dataset_size": {

            "total_rows": initial_rows,

            "total_columns": initial_col,

            "total_cells": total_cell_value,

            "shape": [
                initial_rows,
                initial_col
            ]

        },


        # --------------------------------------
        # Data Types
        # --------------------------------------

        "data_type": data_types,


        # --------------------------------------
        # Missing Values
        # --------------------------------------

        "missing_values": {

            "column_wise":
                missing_values,

            "total":
                total_null_value,

            "percentage":
                null_percentage

        },


        # --------------------------------------
        # Duplicate Information
        # --------------------------------------

        "duplicates": {

            "count":
                duplicate_count,

            "percentage":
                duplicate_percentage

        },


        # --------------------------------------
        # Column Information
        # --------------------------------------

        "column_information":
            column_information,


        # --------------------------------------
        # Statistical Description
        # --------------------------------------

        "describe":
            describe_data,


        # --------------------------------------
        # Dataset Preview
        # --------------------------------------

        "Preview":
            preview

    }