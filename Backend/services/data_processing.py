
import pandas as pd
import numpy as np
import re


# ==========================================
# 1. NORMALIZE COLUMN NAMES
# ==========================================

def normalize_column_names(df: pd.DataFrame) -> pd.DataFrame:

    df = df.copy()

    normalized_columns = []

    for column in df.columns:

        name = str(column).strip().lower()

        name = re.sub(r"[^\w]+", "_", name)

        name = re.sub(r"_+", "_", name)

        name = name.strip("_")

        normalized_columns.append(name)

    # Prevent duplicate column names after normalization
    counts = {}
    unique_columns = []

    for name in normalized_columns:

        counts[name] = counts.get(name, 0) + 1

        if counts[name] > 1:
            name = f"{name}_{counts[name]}"

        unique_columns.append(name)

    df.columns = unique_columns

    return df


# ==========================================
# 2. FILL MISSING VALUES
# ==========================================

def apply_missing_rule(
    df: pd.DataFrame,
    column: str,
    strategy: str,
    custom_value=None
) -> pd.DataFrame:

    if column not in df.columns:
        raise KeyError(f"Column '{column}' not found.")

    if strategy == "keep":
        return df

    if strategy == "drop_rows":

        return df.dropna(subset=[column]).copy()

    if strategy == "fill_mean":

        if not pd.api.types.is_numeric_dtype(df[column]):
            raise ValueError(
                f"Mean can only be applied to numeric column '{column}'."
            )

        value = df[column].mean()

        if pd.notna(value):
            df[column] = df[column].fillna(value)

        return df

    if strategy == "fill_median":

        if not pd.api.types.is_numeric_dtype(df[column]):
            raise ValueError(
                f"Median can only be applied to numeric column '{column}'."
            )

        value = df[column].median()

        if pd.notna(value):
            df[column] = df[column].fillna(value)

        return df

    if strategy == "fill_mode":

        mode_values = df[column].mode(dropna=True)

        if not mode_values.empty:
            df[column] = df[column].fillna(mode_values.iloc[0])

        return df

    if strategy == "fill_custom":

        if custom_value is None:
            raise ValueError(
                f"Custom value is required for column '{column}'."
            )

        value = custom_value

        if pd.api.types.is_numeric_dtype(df[column]):

            try:
                value = pd.to_numeric(value)

            except (ValueError, TypeError):
                raise ValueError(
                    f"Custom value for '{column}' must be numeric."
                )

        df[column] = df[column].fillna(value)

        return df

    raise ValueError(
        f"Unsupported missing-value strategy: {strategy}"
    )


# ==========================================
# 3. PROCESS DATASET
# ==========================================

def process_dataset(
    original_df: pd.DataFrame,
    missing_rules: dict = None,
    custom_values: dict = None,
    remove_duplicates: bool = True,
    normalize_columns: bool = True
) -> pd.DataFrame:

    if not isinstance(original_df, pd.DataFrame):
        raise TypeError("Input must be a Pandas DataFrame.")

    if original_df.empty:
        raise ValueError("Cannot process an empty dataset.")

    # Preserve original dataset
    df = original_df.copy(deep=True)

    missing_rules = missing_rules or {}
    custom_values = custom_values or {}

    # ======================================
    # STEP 1: NORMALIZE COLUMN NAMES
    # ======================================

    if normalize_columns:
        df = normalize_column_names(df)

    # ======================================
    # STEP 2: APPLY COLUMN-WISE RULES
    # ======================================

    for column, strategy in missing_rules.items():

        # Frontend sends normalized column names.
        # When normalization is disabled, also
        # support matching the original column name.

        if column not in df.columns:

            if normalize_columns:
                raise KeyError(
                    f"Configured column '{column}' not found."
                )

            matching_columns = [
                col for col in df.columns
                if str(col).strip().lower() ==
                str(column).strip().lower()
            ]

            if not matching_columns:
                raise KeyError(
                    f"Configured column '{column}' not found."
                )

            actual_column = matching_columns[0]

        else:
            actual_column = column

        df = apply_missing_rule(
            df=df,
            column=actual_column,
            strategy=strategy,
            custom_value=custom_values.get(column)
        )

    # ======================================
    # STEP 3: REMOVE DUPLICATES
    # ======================================

    if remove_duplicates:

        df = df.drop_duplicates().copy()

    # ======================================
    # STEP 4: RESET INDEX
    # ======================================

    df = df.reset_index(drop=True)

    return df
