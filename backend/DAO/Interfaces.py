from uuid import UUID
from pydantic import Field, BaseModel


class Workflow(BaseModel):
    user_id: str
    project_id: UUID
    id: UUID
    name: str
    llm: str | UUID
    input_data_model: UUID
    output_data_model: UUID
    active: bool


class DataModel(BaseModel):
    user_id: str
    project_id: UUID
    id: UUID
    name: str


class DataModelField(BaseModel): 
    user_id: str
    data_model_id: UUID
    id: UUID 
    name: str
    type: str
    description: str | None