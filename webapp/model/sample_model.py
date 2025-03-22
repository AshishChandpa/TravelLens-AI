class SampleModel:
    """Sample data model class."""

    def __init__(self, name, value) -> None:
        self.name = name
        self.value = value

    def __repr__(self) -> str:
        return f"<SampleModel(name={self.name}, value={self.value})>"
