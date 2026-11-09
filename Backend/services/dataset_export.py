
from pathlib import Path

from services.dataset_storage import get_cleaned_dataset


def export_cleaned_dataset(
    dataset_id: str,
    output_dir: str = "exports"
) -> str:

    cleaned_df = get_cleaned_dataset(dataset_id)

    export_directory = Path(output_dir)

    export_directory.mkdir(
        parents=True,
        exist_ok=True
    )

    file_path = export_directory / (
        f"cleaned_dataset_{dataset_id}.csv"
    )

    cleaned_df.to_csv(
        file_path,
        index=False,
        encoding="utf-8-sig"
    )

    return str(file_path.resolve())
