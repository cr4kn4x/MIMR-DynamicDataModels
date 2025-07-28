import os, dotenv, logging, pydantic, dspy, psycopg
import uuid
from uuid import UUID
from SupabaseApiAuth import supabase_token_required, ensure_supabase_auth
from flask import Flask, jsonify, request
from flask_cors import CORS

import postgrest.exceptions

from InputValidation import *

from pydantic import create_model, Field, BaseModel

############################################################
############################################################
# load secrets                                          ####
dotenv.load_dotenv("./secrets/.env")                    ####
app = Flask(__name__)                                   ####
#                                                       ####
# CORS                                                  ####
CORS(app, origins="*")                                  ####
#                                                       ####
#  initialize DAO                                       ####
# dao = DAO(dsn=os.environ.get("SUPABASE_POSTGRES_DSN"))  ####
#                                                       ####
############################################################
############################################################





############################################################
############################################################

from supabase import create_client, Client, ClientOptions


@app.errorhandler(postgrest.exceptions.APIError)
def handle_postgrest_api_error(e: postgrest.exceptions.APIError): 
    logging.exception(e)
    return jsonify({"error": e.message}), 400



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
    llm: str = Field()



class RegistrationStatus(BaseModel): 
    registered: bool = Field()
    email_confirmed: bool = Field()

class SupabaseServiceDAO: 
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

            
supabaseServiceDao = SupabaseServiceDAO(os.environ.get("SUPABASE_POSTGRES_DSN"))

class SupabaseApiData: 
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
        projects = self.client.table("projects").select("*").execute()
        projects = [Project(**obj) for obj in projects.data]
        return projects
    
    def insertDataModel(self, data_model: DataModel):
        return self.client.table("data_models").insert(data_model.model_dump(mode="json")).execute()


    def getDataModelById(self, id: str) -> PopulatedDataModel:
        response = self.client.table("data_models").select("*").eq("id", id).execute()
        return PopulatedDataModel(**response.data[0], fields=self.getDataModelFields(id))


    def getDataModelFields(self, data_model_id: str) -> typing.List[DataModel]: 
        response = self.client.table("data_model_fields").select("*").eq("data_model_id", data_model_id).execute() 
        return [DataModelField(**obj) for obj in response.data]



    
############################################################
############################################################
@app.post("/api/project/create")
@supabase_token_required()
def create_new_project():
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)
    
    request_json = CreateNewProjectRequest(**request.get_json())

    dao = SupabaseApiData(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_ANON_KEY"), jwt=jwt)
    _ = dao.createNewProject(project=Project(user_id=user_info.id, name=request_json.project_name))

    return jsonify({"msg": "Project created successfully"}), 200





@app.get("/api/project/get_all")
@supabase_token_required()
def get_all_projects(): 
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)

    dao = SupabaseApiData(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_ANON_KEY"), jwt=jwt)
    projects = dao.getAllProjects()

    return jsonify({"projects": [obj.model_dump() for obj in projects]})



@app.post("/api/data_models/create")
@supabase_token_required()
def create_data_model():
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)

    request_json = CreateNewDataModelRequest(**request.get_json())

    dao = SupabaseApiData(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_ANON_KEY"), jwt=jwt)
    dao.insertDataModel(data_model=DataModel(user_id=user_info.id, project_id=request_json.project_id, name=request_json.data_model_name))
    
    return jsonify({"msg": "Successfully created new data model"})



@app.post("/api/data_models/get_by_id")
@supabase_token_required()
def get_data_model_by_id():
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)

    data = GetDataModelByIdRequest(**request.get_json())
    dao = SupabaseApiData(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_ANON_KEY"), jwt=jwt)

    dm = dao.getDataModelById(data.data_model_id)
    return jsonify({"data_model": dm.model_dump()})
    
   
    
    


@app.post("/api/data_models/get_by_project_id")
@supabase_token_required()
def get_data_models_by_project():
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)

    # get json body
    request_json = GetDataModelsByProjectIdRequest(**request.get_json())

    dao = SupabaseApiData(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_ANON_KEY"), jwt=jwt)
    data_models = dao.getDataModelsByProject(request_json.project_id)

    return jsonify({"data_models": [dm.model_dump() for dm in data_models]})







@app.post("/api/data_models/create_field")
@supabase_token_required()
def create_data_model_field(): 
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)


    # get json body
    request_json = CreateDataModelFieldRequest(**request.get_json())
    field = request_json.new_field


    dao = SupabaseApiData(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_ANON_KEY"), jwt=jwt)
    dao.insertDataModelField(DataModelField(user_id=user_info.id, data_model_id=request_json.data_model_id, name=field.name, type=field.type, description=field.description))

    return jsonify({"msg": "Successfully created new data model field"})






@app.post("/api/data_models/change_field")
@supabase_token_required()
def change_data_model():
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)

    request_json = ChangeDataModelFieldRequest(**request.get_json())
    field = request_json.new_field
    
    dao = SupabaseApiData(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_ANON_KEY"), jwt=jwt)
    dao.changeDataModelField(data_model_field=DataModelField(user_id=user_info.id, id=field.id, data_model_id=request_json.data_model_id, name=field.name, type=field.type, description=field.description))
   
    return jsonify({"msg": "Successfully applied changes to data model field"})





@app.post("/api/data_models/delete_field")
@supabase_token_required()
def delete_data_model_field(): 
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)

    request_json = DeleteDataModelFieldRequest(**request.get_json())

    dao = SupabaseApiData(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_ANON_KEY"), jwt=jwt)
    dao.deleteDataModelField(request_json.field_id)

    return jsonify({"msg": "Successfully deleted data model field"})



@app.post("/api/data_models/delete")
@supabase_token_required()
def delete_data_model():
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)

    request_json = DeleteDataModelRequest(**request.get_json())
    dao = SupabaseApiData(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_ANON_KEY"), jwt=jwt)
    dao.deleteDataModel(request_json.data_model_id)
    
    return jsonify({"msg": "Successfully deleted data model"})





@app.post("/api/workflows/get_by_project_id")
@supabase_token_required()
def get_workflows_by_project():
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)

    request_json = GetWorkflowsByProjectIdRequest(**request.get_json())
    dao = SupabaseApiData(os.environ.get("SUPABASE_URL"), os.environ.get("SUPABASE_ANON_KEY"), jwt=jwt)
    workflows = dao.getWorkflowsByProject(request_json.project_id)
    return jsonify({"workflows": [w.model_dump() for w in workflows]})



@app.post("/api/llms/get")
@supabase_token_required()
def get_llms():
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)

    llms = [
        {"id": "001", "name": "default"}
    ]
    return jsonify({"llms": llms})




@app.post("/api/auth/check_registration_status")
def check_registration_status(): 
    email = request.get_json().get("email", None)

    if email == None: 
        return jsonify({"msg": "Please provide a valid email address"}), 404
    
    registration_status = supabaseServiceDao.getRegistrationStatus(email)

    return jsonify(registration_status.model_dump(mode="json"))










@app.post("/api/workflows/create")
@supabase_token_required()
def create_workflow():
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)

    data = CreateWorkflowRequest(**request.get_json())
    workflow_id = dao.create_workflow(user_info.id, data.project_id, data.llm, data.input_data_model, data.output_data_model, data.active, data.name)
    
    return jsonify({"msg": "Workflow created", "id": workflow_id})


@app.post("/api/workflows/get_by_id")
@supabase_token_required()
def get_workflow_by_id(): 
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)

    data = GetWorkflowByIdRequest(**request.get_json())
    workflow = dao.get_workflow_by_id(user_info.id, data.workflow_id)
    
    return jsonify({"workflow": workflow.model_dump()})


@app.post("/api/workflows/security/create_access_token")
@supabase_token_required()
def create_workflow_access_token():
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)
    
    data = CreateWorkflowApiKeyRequest(**request.get_json())
    api_key = dao.create_workflow_api_key(user_info.id, data.workflow_id, data.key_name)

    return jsonify({"api_key": api_key})


@app.post("/api/workflows/security/access_tokens_preview")
@supabase_token_required()
def get_workflow_access_tokens_preview():
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)
    
    data = GetWorkflowAccessTokensPreviewApiKeyRequest(**request.get_json())
    api_keys = dao.get_workflow_api_key_previews(user_info.id, data.workflow_id)

    return jsonify({"api_keys": [obj.model_dump() for obj in api_keys]})


@app.post("/api/workflows/security/delete_access_token")
@supabase_token_required()
def delete_workflow_access_token():
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)
    
    data = DeleteWorkflowAccessTokenRequest(**request.get_json())
    dao.delete_workflow_api_key(user_info.id, data.key_id)

    return jsonify({"msg": "Access Token deleted"})


@app.post("/api/workflows/security/refresh_access_token")
@supabase_token_required()
def refresh_workflow_access_token():
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)
    
    data = RefreshWorkflowAccessTokenRequest(**request.get_json())
    api_key = dao.refresh_workflow_api_key(user_info.id, data.key_id)

    return jsonify({"api_key": api_key})





@app.route("/api/predict/<workflow_id>", methods=["POST"])
def predict(workflow_id):
    logging.exception("THIS ROUTE IS NOT READY FOR PRODUCTION!")


    data = request.get_json()
    

    workflow = dao.get_workflow_no_authentication(workflow_id=workflow_id)

    
    input_data_model = dao.get_data_model_no_authentication(workflow.input_data_model)
    input_data_model_fields = dao.get_data_model_fields_no_authentication(workflow.input_data_model)

    output_data_model = dao.get_data_model_no_authentication(workflow.output_data_model)
    output_data_model_fields = dao.get_data_model_fields_no_authentication(workflow.output_data_model)

    
    # 
    type_map = {
        "str": str, 
        "int": int, 
        "float": float, 
        "boolean": bool,
    }

    input_base_model_fields = {
        f.name: (type_map[f.type], Field(description=f.description)) for f in input_data_model_fields
    }

    input_base_model = create_model(input_data_model.name, 
        **input_base_model_fields
    )

    

    output_base_model_fields = {
        f.name: (type_map[f.type], Field(description=f.description)) for f in output_data_model_fields
    }

    output_base_model = create_model(output_data_model.name, 
        **output_base_model_fields
    )


    llm = dspy.LM(model="openai/mistralai/Mistral-Nemo-Instruct-2407", base_url="https://api.deepinfra.com/v1/openai", api_key=os.environ.get("DEEPINFRA_API"), max_tokens=1024, temperature=0.3)

    dspy.configure(lm=llm)

    class Signature(dspy.Signature):
        input: input_base_model = dspy.InputField()
        prediction: output_base_model = dspy.OutputField()
    
    program = dspy.Predict(Signature)
    

    pred = program(input=input_base_model(**data["data"]))
    

    return jsonify({"workflow_id": workflow_id, "pred": pred.prediction.model_dump()})



# app.run(debug=True, host="0.0.0.0")
# flask --app app.py run --debug