from uuid import UUID
from pydantic import BaseModel


class ProjectDatabase(BaseModel): 
    user_id: str
    id: UUID
    name: str

class ProjectApi(BaseModel): 
    id: UUID
    name: str