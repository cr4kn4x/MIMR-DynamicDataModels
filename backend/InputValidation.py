import typing
import re
from pydantic import BaseModel, Field, field_validator, ValidationError, StringConstraints


str_striped = typing.Annotated[str, StringConstraints(strip_whitespace=True)] 

MAX_LENGTH_PROJECT_NAME = 64
MAX_LENGTH_DATA_MODEL_NAME = 64
MAX_LENGTH_DATA_MODEL_FIELD_NAME = 64
MAX_LENGTH_WORKFLOW_NAME = 64
MAX_LENGTH_DATA_MODEL_FIELD_DESCRIPTION = 1024
MAX_LENGTH_API_KEY_NAME = 64

UUID_LENGTH = 36

def validate_string_input(input: str):
    if not re.fullmatch(r"[a-zA-Z0-9_]*", input): 
        raise ValueError("invalid charset")
    
    return input


class CreateNewProjectRequest(BaseModel):
    project_name: str_striped = Field(min_length=1, max_length=MAX_LENGTH_PROJECT_NAME)

    @field_validator("project_name", mode="after")
    def validate_project_name(cls, value: str):
        return validate_string_input(value)
    

class CreateNewDataModelRequest(BaseModel): 
    project_id: str = Field(min_length=UUID_LENGTH, max_length=UUID_LENGTH)
    data_model_name: str_striped = Field(min_length=1, max_length=MAX_LENGTH_DATA_MODEL_NAME)

    @field_validator("data_model_name", mode="after")
    def validate_data_model_name(cls, value: str): 
        return validate_string_input(value)
    

class GetDataModelByIdRequest(BaseModel): 
    data_model_id: str = Field(min_length=UUID_LENGTH, max_length=UUID_LENGTH)


class GetDataModelsByProjectIdRequest(BaseModel): 
    project_id: str = Field(min_length=UUID_LENGTH, max_length=UUID_LENGTH)





class CreateDataModelFieldRequest(BaseModel): 

    class FieldRequest(BaseModel): 
        name: str_striped = Field() 
        type: str_striped = Field() 
        description: typing.Optional[str_striped] = Field()

        @field_validator("name", mode="after")
        def validate_data_model_name(cls, value: str): 
            return validate_string_input(value)

    data_model_id: str = Field(min_length=UUID_LENGTH, max_length=UUID_LENGTH) 
    new_field: FieldRequest = Field()


class ChangeDataModelFieldRequest(BaseModel): 
    class FieldRequest(BaseModel): 
        id: str = Field(min_length=UUID_LENGTH, max_length=UUID_LENGTH)
        name: str_striped = Field() 
        type: str_striped = Field() 
        description: typing.Optional[str_striped] = Field()

        @field_validator("name", mode="after")
        def validate_data_model_name(cls, value: str): 
            return validate_string_input(value)

    data_model_id: str = Field(min_length=UUID_LENGTH, max_length=UUID_LENGTH) 
    new_field: FieldRequest = Field()


class DeleteDataModelFieldRequest(BaseModel): 
    field_id: str = Field(min_length=UUID_LENGTH, max_length=UUID_LENGTH)


class DeleteDataModelRequest(BaseModel):
    data_model_id: str = Field(min_length=UUID_LENGTH, max_length=UUID_LENGTH)


class GetWorkflowsByProjectIdRequest(BaseModel):
    project_id: str = Field(min_length=UUID_LENGTH, max_length=UUID_LENGTH)


class CreateWorkflowRequest(BaseModel):
    name: str_striped = Field() 
    input_data_model: str = Field(min_length=UUID_LENGTH, max_length=UUID_LENGTH)
    output_data_model: str = Field(min_length=UUID_LENGTH, max_length=UUID_LENGTH) 
    active: bool = Field() 
    project_id: str = Field(min_length=UUID_LENGTH, max_length=UUID_LENGTH) 

    @field_validator("name", mode="after")
    def validate_data_model_name(cls, value: str): 
        return validate_string_input(value)


class GetWorkflowByIdRequest(BaseModel): 
    workflow_id: str = Field(min_length=UUID_LENGTH, max_length=UUID_LENGTH)


class CreateWorkflowApiKeyRequest(BaseModel): 
    workflow_id: str = Field(min_length=UUID_LENGTH, max_length=UUID_LENGTH)
    key_name: str_striped = Field(min_length=1, max_length=MAX_LENGTH_API_KEY_NAME)    



class GetWorkflowAccessTokensPreviewApiKeyRequest(BaseModel): 
    workflow_id: str = Field(min_length=UUID_LENGTH, max_length=UUID_LENGTH)

class DeleteWorkflowAccessTokenRequest(BaseModel):
    key_id: str = Field(min_length=UUID_LENGTH, max_length=UUID_LENGTH)

class RefreshWorkflowAccessTokenRequest(BaseModel): 
    key_id: str = Field(min_length=UUID_LENGTH, max_length=UUID_LENGTH)