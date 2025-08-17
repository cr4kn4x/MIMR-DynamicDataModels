import typing, uuid, psycopg, secrets
from uuid import UUID
from pydantic import BaseModel, Field
from supabase import create_client, Client, ClientOptions
from datetime import datetime, timezone

class Project(BaseModel):
    user_id: UUID = Field()
    id: UUID = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = Field()


class DataModel(BaseModel):
    user_id: UUID = Field()
    id: UUID = Field(default_factory=lambda: str(uuid.uuid4()))
    project_id: UUID = Field()
    name: str = Field()


class DataModelField(BaseModel): 
    user_id: UUID = Field() 
    id: UUID = Field(default_factory=lambda: str(uuid.uuid4())) 
    data_model_id: UUID = Field() 
    name: str = Field() 
    type: str = Field() 
    description: str | None = Field() 


class PopulatedDataModel(DataModel): 
    fields: typing.List[DataModelField] = Field(default=[])


class Workflow(BaseModel):
    user_id: UUID = Field()
    project_id: UUID = Field()
    id: UUID = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str = Field()
    input_data_model: UUID = Field()
    output_data_model: UUID = Field()
    active: bool = Field()

class WorkflowVariant(BaseModel): 
    id: UUID = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: UUID = Field()
    workflow_id: UUID = Field()



class WorkflowApiKey(BaseModel): 
    id: UUID = Field(default_factory=lambda: str(uuid.uuid4())) 
    workflow_id: UUID = Field() 
    user_id: UUID = Field() 
    name: str = Field() 
    api_key: str = Field()
    api_key_preview: str = Field() 
    created_at: typing.Optional[datetime] = Field()
    last_used_at: typing.Optional[datetime] = Field()
    last_refreshed_at: typing.Optional[datetime] = Field()
    

class WorkflowApiKeyPreview(BaseModel): 
    id: str | UUID = Field()
    workflow_id: str | UUID = Field()
    name: str = Field()
    api_key_preview: str = Field()
    created_at: typing.Optional[datetime] = Field()
    last_used_at: typing.Optional[datetime] = Field()
    last_refreshed_at: typing.Optional[datetime] = Field()



class RegistrationStatus(BaseModel): 
    registered: bool = Field()
    email_confirmed: bool = Field()


class SupabaseRegistrationStatusDAO: 
    def __init__(self, dsn: str):
        self.dsn = dsn 

    def __get_connection(self):
        return psycopg.connect(self.dsn, row_factory=psycopg.rows.dict_row)
    
    def getRegistrationStatus(self, email: str) -> RegistrationStatus: 
        with self.__get_connection() as conn: 
            with conn.cursor() as cur: 
                cur.execute("SELECT email_confirmed_at FROM auth.users WHERE email=%s", (email, ))
                res = cur.fetchone()

            if res == None: 
                # email is not registered at all 
                return RegistrationStatus(registered=False, email_confirmed=False)
            else: 
                if res["email_confirmed_at"] != None: 
                    # email is registered and confirmed
                    return RegistrationStatus(registered=True, email_confirmed=True)
                else: 
                    # email is registered but not  confirmed 
                    return RegistrationStatus(registered=True, email_confirmed=False)

            

class SupabaseDataApi: 
    def __init__(self, supabase_url: str, supabase_key: str, jwt: str):
        self.client: Client = create_client(supabase_url=supabase_url, supabase_key=supabase_key, options=ClientOptions(headers={"Authorization": f"Bearer {jwt}"}))


    def getDataModelsByProject(self, project_id: str):
        data_models = self.client.table("data_models").select("*").eq("project_id", project_id).execute()
        return [PopulatedDataModel(**obj, fields=self.getDataModelFields(obj["id"])) for obj in data_models.data]


    def insertDataModelField(self, data_model_field: DataModelField):
        return self.client.table("data_model_fields").insert(data_model_field.model_dump(mode="json")).execute()


    def changeDataModelField(self, data_model_field: DataModelField):
        update = data_model_field.model_dump(mode="json")

        field_id = update.pop("id")
        user_id = update.pop("user_id")

        response = self.client.table("data_model_fields").update(update).eq("id", field_id).execute()
        return response


    def deleteDataModelField(self, field_id: str):
        return self.client.table("data_model_fields").delete().eq("id", field_id).execute()
        

    def deleteDataModel(self, data_model_id: str):
        return self.client.table("data_models").delete().eq("id", data_model_id).execute()
    

    def createNewProject(self, project: Project): 
        return self.client.table("projects").insert(project.model_dump(mode="json")).execute()
    
    def getAllProjects(self): 
        res = self.client.table("projects").select("*").execute()
        return [Project(**obj) for obj in res.data]
        
    
    def insertDataModel(self, data_model: DataModel):
        return self.client.table("data_models").insert(data_model.model_dump(mode="json")).execute()


    def getDataModelById(self, id: str) -> PopulatedDataModel:
        res = self.client.table("data_models").select("*").eq("id", id).execute()
        return PopulatedDataModel(**res.data[0], fields=self.getDataModelFields(id))


    def getDataModelFields(self, data_model_id: str) -> typing.List[DataModelField]: 
        res = self.client.table("data_model_fields").select("*").eq("data_model_id", data_model_id).execute() 
        return [DataModelField(**obj) for obj in res.data]


    def getWorkflowsByProject(self, project_id: str) -> typing.List[Workflow]:
        res = self.client.table("workflows").select("*").eq("project_id", project_id).execute() 
        return [Workflow(**obj) for obj in res.data]
    

    def createNewWorkflow(self, workflow: Workflow) -> Workflow: 
        res = self.client.table("workflows").insert(workflow.model_dump(mode="json")).execute()
        return Workflow(**res.data[0])
    
    def getWorkflowById(self, workflow_id: str) -> Workflow:
        res = self.client.table("workflows").select("*").eq("id", workflow_id).execute()
        return Workflow(**res.data[0])


    def createWorkflowApiKey(self, workflow_id: str, user_id: str, name: str) -> str:

        api_key = "mimr_" + secrets.token_urlsafe(32)
        api_key_preview = f"{api_key[:5]}...{api_key[-4:]}"
        
        api_key_obj = WorkflowApiKey(workflow_id=workflow_id, user_id=user_id, name=name, api_key=api_key, api_key_preview=api_key_preview, created_at=datetime.now(timezone.utc), last_used_at=None, last_refreshed_at=None)

        res = self.client.table("workflow_api_keys").insert(api_key_obj.model_dump(mode="json")).execute() 

        res = WorkflowApiKey(**res.data[0])

        return res.api_key
    

    def getWorkflowApiKeyPreview(self, workflow_id: str): 
        res = self.client.table("workflow_api_keys").select("id,workflow_id,name,api_key_preview,created_at,last_used_at,last_refreshed_at").eq("workflow_id", workflow_id).execute()

        return [WorkflowApiKeyPreview(**obj) for obj in res.data]
    

    def deleteWorkflowApiKey(self, key_id: str): 
        return self.client.table("workflow_api_keys").delete().eq("id", key_id).execute()   
    
    def refreshWorkflowApiKey(self, key_id: str) -> str: 
        api_key = "mimr_" + secrets.token_urlsafe(32)
        api_key_preview = f"{api_key[:5]}...{api_key[-4:]}"

        res = self.client.table("workflow_api_keys").update({"api_key": api_key, "api_key_preview": api_key_preview}).eq("id", key_id).execute()

        res = WorkflowApiKey(**res.data[0])
        return res.api_key
    


class SupabaseServiceLevelDataApi: 
    def __init__(self, supabase_url: str, supabase_service_key_secret: str):
        self.client: Client = create_client(supabase_url=supabase_url, supabase_key=supabase_service_key_secret)


    def _getWorkflowById(self, workflow_id: str, user_id: str):        
        res = self.client.table("workflows").select("*").eq("user_id", user_id).eq("id", workflow_id).single().execute()
        return Workflow(**res.data)
    

    def _getWorkflowApiKey(self, workflow_id: str, api_key: str): 
        res = self.client.table("workflow_api_keys").select("*").eq("workflow_id", workflow_id).eq("api_key", api_key).single().execute()
        return WorkflowApiKey(**res.data)
    
    def getDataModelFields(self, data_model_id: str, user_id: str) -> typing.List[DataModelField]: 
        res = self.client.table("data_model_fields").select("*").eq("data_model_id", data_model_id).eq("user_id", user_id).execute()
        return [DataModelField(**obj) for obj in res.data]

    def getDataModelById(self, id: str, user_id: str) -> PopulatedDataModel:
        res = self.client.table("data_models").select("*").eq("id", id).eq("user_id", user_id).single().execute()
        return PopulatedDataModel(**res.data, fields=self.getDataModelFields(id, user_id))
    

    def getWorkflowAuthenticatedByApiKey(self, req_workflow_id: str, req_api_key: str): 

        workflow_api_key = self._getWorkflowApiKey(req_workflow_id, req_api_key)
        internal_user_id = workflow_api_key.user_id
        workflow = self._getWorkflowById(workflow_id=req_workflow_id, user_id=internal_user_id)

        # some assertions
        assert str(workflow.id) == req_workflow_id
        assert isinstance(workflow_api_key, WorkflowApiKey) and workflow_api_key.api_key == req_api_key and len(req_api_key) > 10 and len(workflow_api_key.api_key) > 10
        assert isinstance(workflow, Workflow) and workflow.id == workflow_api_key.workflow_id and str(workflow.id) == req_workflow_id
        assert workflow.user_id == internal_user_id and workflow_api_key.user_id == internal_user_id

        return workflow