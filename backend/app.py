import os, dotenv, logging, pydantic, dspy, psycopg
import uuid
from uuid import UUID
from SupabaseApiAuth import supabase_token_required, ensure_supabase_auth
from flask import Flask, jsonify, request
from flask_cors import CORS

import postgrest.exceptions

from InputValidation import *
from pydantic import create_model
from DAO.SupabaseDataAccess import SupabaseRegistrationStatusDAO, SupabaseDataApi, Project, Workflow, DataModel, DataModelField, SupabaseServiceLevelDataApi, PopulatedDataModel

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


supabase_pg_dao = SupabaseRegistrationStatusDAO(os.environ.get("SUPABASE_POSTGRES_DSN"))


supabase_service_dao = SupabaseServiceLevelDataApi(os.environ.get("SUPABASE_URL"), supabase_service_key_secret=os.environ.get("SUPABASE_SERVICE_KEY_SECRET"))

__supabase_user_data_api_base_args = dict(supabase_url=os.environ.get("SUPABASE_URL"), supabase_key=os.environ.get("SUPABASE_ANON_KEY"))
############################################################
############################################################



@app.errorhandler(postgrest.exceptions.APIError)
def handle_postgrest_api_error(e: postgrest.exceptions.APIError): 
    logging.exception(e)
    return jsonify({"error": e.message}), 400




    
############################################################
############################################################
@app.post("/api/project/create")
@supabase_token_required()
def create_new_project():
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)
    
    request_json = CreateNewProjectRequest(**request.get_json())

    dao = SupabaseDataApi(**__supabase_user_data_api_base_args, jwt=jwt)
    _ = dao.createNewProject(project=Project(user_id=user_info.id, name=request_json.project_name))

    return jsonify({"msg": "Project created successfully"}), 200





@app.get("/api/project/get_all")
@supabase_token_required()
def get_all_projects(): 
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)

    dao = SupabaseDataApi(**__supabase_user_data_api_base_args, jwt=jwt)
    projects = dao.getAllProjects()

    return jsonify({"projects": [obj.model_dump() for obj in projects]})



@app.post("/api/data_models/create")
@supabase_token_required()
def create_data_model():
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)

    request_json = CreateNewDataModelRequest(**request.get_json())

    dao = SupabaseDataApi(**__supabase_user_data_api_base_args, jwt=jwt)
    dao.insertDataModel(data_model=DataModel(user_id=user_info.id, project_id=request_json.project_id, name=request_json.data_model_name))
    
    return jsonify({"msg": "Successfully created new data model"})



@app.post("/api/data_models/get_by_id")
@supabase_token_required()
def get_data_model_by_id():
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)

    data = GetDataModelByIdRequest(**request.get_json())
    dao = SupabaseDataApi(**__supabase_user_data_api_base_args, jwt=jwt)

    dm = dao.getDataModelById(data.data_model_id)
    return jsonify({"data_model": dm.model_dump()})
    
   
    
    


@app.post("/api/data_models/get_by_project_id")
@supabase_token_required()
def get_data_models_by_project():
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)

    # get json body
    request_json = GetDataModelsByProjectIdRequest(**request.get_json())

    dao = SupabaseDataApi(**__supabase_user_data_api_base_args, jwt=jwt)
    data_models = dao.getDataModelsByProject(request_json.project_id)

    return jsonify({"data_models": [dm.model_dump() for dm in data_models]})







@app.post("/api/data_models/create_field")
@supabase_token_required()
def create_data_model_field(): 
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)


    # get json body
    request_json = CreateDataModelFieldRequest(**request.get_json())
    field = request_json.new_field


    dao = SupabaseDataApi(**__supabase_user_data_api_base_args, jwt=jwt)
    dao.insertDataModelField(DataModelField(user_id=user_info.id, data_model_id=request_json.data_model_id, name=field.name, type=field.type, description=field.description))

    return jsonify({"msg": "Successfully created new data model field"})






@app.post("/api/data_models/change_field")
@supabase_token_required()
def change_data_model():
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)

    request_json = ChangeDataModelFieldRequest(**request.get_json())
    field = request_json.new_field
    
    dao = SupabaseDataApi(**__supabase_user_data_api_base_args, jwt=jwt)
    dao.changeDataModelField(data_model_field=DataModelField(user_id=user_info.id, id=field.id, data_model_id=request_json.data_model_id, name=field.name, type=field.type, description=field.description))
   
    return jsonify({"msg": "Successfully applied changes to data model field"})





@app.post("/api/data_models/delete_field")
@supabase_token_required()
def delete_data_model_field(): 
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)

    request_json = DeleteDataModelFieldRequest(**request.get_json())

    dao = SupabaseDataApi(**__supabase_user_data_api_base_args, jwt=jwt)
    dao.deleteDataModelField(request_json.field_id)

    return jsonify({"msg": "Successfully deleted data model field"})



@app.post("/api/data_models/delete")
@supabase_token_required()
def delete_data_model():
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)

    request_json = DeleteDataModelRequest(**request.get_json())
    dao = SupabaseDataApi(**__supabase_user_data_api_base_args, jwt=jwt)
    dao.deleteDataModel(request_json.data_model_id)
    
    return jsonify({"msg": "Successfully deleted data model"})





@app.post("/api/workflows/get_by_project_id")
@supabase_token_required()
def get_workflows_by_project():
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)

    request_json = GetWorkflowsByProjectIdRequest(**request.get_json())

    dao = SupabaseDataApi(**__supabase_user_data_api_base_args, jwt=jwt)
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
    
    registration_status = supabase_pg_dao.getRegistrationStatus(email)

    return jsonify(registration_status.model_dump(mode="json"))










@app.post("/api/workflows/create")
@supabase_token_required()
def create_workflow():
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)

    request_json = CreateWorkflowRequest(**request.get_json())

    dao = SupabaseDataApi(**__supabase_user_data_api_base_args, jwt=jwt)

    created_workflow = dao.createNewWorkflow(workflow=Workflow(user_id=user_info.id, project_id=request_json.project_id, name=request_json.name, input_data_model=request_json.input_data_model, output_data_model=request_json.output_data_model, active=request_json.active, llm=request_json.llm))

    workflow_id = created_workflow["id"]
    return jsonify({"msg": "Workflow created", "id": workflow_id})


@app.post("/api/workflows/get_by_id")
@supabase_token_required()
def get_workflow_by_id(): 
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)

    request_json = GetWorkflowByIdRequest(**request.get_json())
    
    dao = SupabaseDataApi(**__supabase_user_data_api_base_args, jwt=jwt)
    workflow = dao.getWorkflowById(request_json.workflow_id)
    
    return jsonify({"workflow": workflow.model_dump()})



@app.post("/api/workflows/security/create_access_token")
@supabase_token_required()
def create_workflow_access_token():
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)
    
    request_json = CreateWorkflowApiKeyRequest(**request.get_json())
    
    dao = SupabaseDataApi(**__supabase_user_data_api_base_args, jwt=jwt)
    
    api_key = dao.createWorkflowApiKey(workflow_id=request_json.workflow_id, user_id=user_info.id, name=request_json.key_name)

    return jsonify({"api_key": api_key})



@app.post("/api/workflows/security/access_tokens_preview")
@supabase_token_required()
def get_workflow_access_tokens_preview():
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)
    
    request_json = GetWorkflowAccessTokensPreviewApiKeyRequest(**request.get_json())
    dao = SupabaseDataApi(**__supabase_user_data_api_base_args, jwt=jwt)
    api_keys = dao.getWorkflowApiKeyPreview(request_json.workflow_id)

    return jsonify({"api_keys": [obj.model_dump() for obj in api_keys]})


@app.post("/api/workflows/security/delete_access_token")
@supabase_token_required()
def delete_workflow_access_token():
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)
    
    request_json = DeleteWorkflowAccessTokenRequest(**request.get_json())
    dao = SupabaseDataApi(**__supabase_user_data_api_base_args, jwt=jwt)

    dao.deleteWorkflowApiKey(request_json.key_id)
    return jsonify({"msg": "Access Token deleted"})


@app.post("/api/workflows/security/refresh_access_token")
@supabase_token_required()
def refresh_workflow_access_token():
    decoded_jwt, user_info, jwt = ensure_supabase_auth(request)
    
    request_json = RefreshWorkflowAccessTokenRequest(**request.get_json())
    
    dao = SupabaseDataApi(**__supabase_user_data_api_base_args, jwt=jwt)
    api_key = dao.refreshWorkflowApiKey(request_json.key_id)

    return jsonify({"api_key": api_key})





def pydantic_init(data_model_meta: PopulatedDataModel): 
    type_map = {
        "str": str, 
        "int": int,
    }

    fields = dict()
    for field_meta in data_model_meta.fields:
        fields[field_meta.name] = (type_map[field_meta.type], Field(description=field_meta.description))

    return create_model(data_model_meta.name, **fields)


@app.post("/api/predict/<workflow_id>")
def predict(workflow_id: str): 

    api_key = request.headers.get("Authorization")

    if api_key.startswith("Bearer "): 
        api_key = api_key[7: ]
    elif api_key.startswith("Bearer"): 
        api_key = api_key[6:]

    assert len(api_key) > 32


    workflow = supabase_service_dao.getWorkflowAuthenticatedByApiKey(req_workflow_id=workflow_id, req_api_key=api_key)


    input_data_model_t = pydantic_init(supabase_service_dao.getDataModelById(workflow.input_data_model, user_id = workflow.user_id))
    
    output_data_model_t = pydantic_init(supabase_service_dao.getDataModelById(workflow.output_data_model, user_id = workflow.user_id))

    assert issubclass(input_data_model_t, BaseModel)
    assert issubclass(output_data_model_t, BaseModel)
    

    request_json = request.get_json() 

    # check input structure 
    input_data = input_data_model_t(**request_json["data"])


    llm = dspy.LM(model="openai/meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo", api_key=os.environ.get("DEEPINFRA_API"), base_url="https://api.deepinfra.com/v1/openai", max_tokens=1024, cache=False)

    class Signature(dspy.Signature): 
        input: input_data_model_t = dspy.InputField() 
        output: output_data_model_t = dspy.OutputField() 

    program = dspy.Predict(Signature)

    with dspy.settings.context(lm=llm): 
        pred = program(input=input_data.model_dump())

    pred = output_data_model_t(**pred.output.model_dump())
    
    return jsonify({"msg": "", "pred": pred.model_dump(mode="json")}), 200

# app.run(debug=True, host="0.0.0.0")
# flask --app app.py run --debug