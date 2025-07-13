import typing 
from uuid import UUID
from pydantic import BaseModel, Field






class ProjectApi(BaseModel):
    id: UUID = Field() 
    name: str = Field()


class WorkflowApi(BaseModel): 
    id: str | UUID = Field()
    project_id: str | UUID = Field() 
    name: str = Field() 
    llm: str = Field() 
    active: bool = Field()
    input_data_model: str | UUID = Field() 
    output_data_model: str | UUID = Field()


class DataModelFieldApi(BaseModel): 
    id: str | UUID = Field()
    name: str = Field()
    type: str = Field() 
    description: typing.Optional[str] = Field() 

class DataModelApi(BaseModel): 
    id: str | UUID = Field()
    name: str = Field()
    fields: typing.List[DataModelFieldApi] = Field()