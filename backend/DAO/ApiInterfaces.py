import typing 
from uuid import UUID
from pydantic import BaseModel


class Project(BaseModel):
    id: UUID
    name: str


class DataModelField(BaseModel):
    id: UUID
    name: str
    type: str
    description: typing.Optional[str]


class DataModel(BaseModel): 
    project_id: UUID
    id: UUID
    name: str
    fields: typing.List[DataModelField]