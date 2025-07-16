import typing 
from uuid import UUID
from pydantic import BaseModel, Field, field_validator
from datetime import date





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


class WorkflowApiKeyPreview(BaseModel): 
    id: str | UUID = Field()
    workflow_id: str | UUID = Field()
    name: str = Field()
    api_key_preview: str = Field()
    created_at: str | date = Field()
    last_used_at: typing.Optional[str | date] = Field()
    last_refreshed_at: typing.Optional[str | date] = Field()


    @field_validator('created_at', 'last_used_at', 'last_refreshed_at', mode='before')
    @classmethod
    def convert_datetime(cls, v):
        if v is None:
            return None
        if hasattr(v, 'isoformat'):
            return v.isoformat()
        return str(v)