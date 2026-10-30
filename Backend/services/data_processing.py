
import pandas as pd


def normalize_column_names(df: pd.DataFrame) -> pd.DataFrame:
    cleaned_df = df.copy(deep=True)

    normalized_columns = (
        cleaned_df.columns.astype(str)
        .str.strip()
        .str.lower()
        .str.replace(r"\s+", "_", regex=True)
        .str.replace(r"[^a-z0-9_]", "", regex=True)
    )

    # Avoid silently overwriting columns with the same normalized name.
    if normalized_columns.duplicated().any():
        raise ValueError(
            "Column names conflict after normalization. "
            "Rename the conflicting columns before processing."
        )

    cleaned_df.columns = normalized_columns

    if any(not column for column in cleaned_df.columns):
        raise ValueError(
            "A column name became empty after normalization."
        )

    return cleaned_df


def remove_duplicate_rows(df: pd.DataFrame) -> pd.DataFrame:
    return df.drop_duplicates().copy()


def handle_missing_values(
    df: pd.DataFrame,
    strategy: str = "keep"
) -> pd.DataFrame:

    cleaned_df = df.copy(deep=True)

    if strategy == "keep":
        return cleaned_df

    if strategy == "drop_rows":
        return cleaned_df.dropna().copy()

    if strategy == "fill_numeric_median":
        numeric_columns = cleaned_df.select_dtypes(
            include="number"
        ).columns

        for column in numeric_columns:
            median_value = cleaned_df[column].median()

            if pd.notna(median_value):
                cleaned_df[column] = (
                    cleaned_df[column].fillna(median_value)
                )

        return cleaned_df

    if strategy == "fill_numeric_mean":
        numeric_columns = cleaned_df.select_dtypes(
            include="number"
        ).columns

        for column in numeric_columns:
            mean_value = cleaned_df[column].mean()

            if pd.notna(mean_value):
                cleaned_df[column] = (
                    cleaned_df[column].fillna(mean_value)
                )

        return cleaned_df

    if strategy == "fill_mode":
        for column in cleaned_df.columns:
            modes = cleaned_df[column].mode(dropna=True)

            if not modes.empty:
                cleaned_df[column] = (
                    cleaned_df[column].fillna(modes.iloc[0])
                )

        return cleaned_df

    raise ValueError(
        "Unsupported missing-value strategy."
    )


def process_dataset(
    df: pd.DataFrame,
    normalize_columns: bool = True,
    remove_duplicates: bool = True,
    missing_strategy: str = "keep"
) -> pd.DataFrame:

    processed_df = df.copy(deep=True)

    if normalize_columns:
        processed_df = normalize_column_names(processed_df)

    processed_df = handle_missing_values(
        processed_df,
        strategy=missing_strategy
    )

    if remove_duplicates:
        processed_df = remove_duplicate_rows(processed_df)

    return processed_df
