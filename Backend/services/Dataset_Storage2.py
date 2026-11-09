from uuid import uuid4
from dataclasses import dataclass,field
from threading import RLock

import pandas as pd

@dataclass
class DatasetState:

    original_df = pd.DataFrame
    working_df = pd.DataFrame
    preview_df = pd.DataFrame | None= None

    undo_history :list = field(default_factory=list)
    redo_history :list = field(default_factory=list)

    version :int = 0

