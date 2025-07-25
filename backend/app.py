import os, dotenv, logging, pydantic, dspy
from firebase import FirebaseIdToken, firebase_token_required, init_firebase
from flask import Flask, jsonify, request
from flask_cors import CORS
from DAO.DAO import DAO, DAOException
from DAO.SupabaseAdminDAO import SupbaseAdminDAO
from DAO.Exceptions import (
    DAOException,
    DAOValidationException,
    DAODuplicateResourceException,
    DAOConnectionException,
    DAOIntegrityException
)
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
dao = DAO(dsn=os.environ.get("POSTGRES_DSN"))           ####
supbase_dao = SupbaseAdminDAO(os.environ.get("SUPABASE_POSTGRES_DSN"))
#                                                       ####
# firebase config                                       ####
init_firebase()                                         ####    
############################################################
############################################################





############################################################
############################################################
def log_exception(e: DAOException): 
    if e.original_exception == None:
        logging.exception(e)
        return
    logging.exception(e.original_exception)
    

@app.errorhandler(DAOValidationException)
def handle_validation_error(e: DAOValidationException):
    log_exception(e)
    return jsonify({"error": e.message}), 400

@app.errorhandler(DAODuplicateResourceException)
def handle_duplicate_error(e: DAODuplicateResourceException):
    log_exception(e)
    return jsonify({"error": e.message}), 409

@app.errorhandler(DAOIntegrityException)
def handle_integrity_error(e: DAOIntegrityException):
    log_exception(e)
    return jsonify({"error": e.message}), 400

@app.errorhandler(DAOConnectionException)
def handle_connection_error(e: DAOConnectionException):
    log_exception(e)
    return jsonify({"error": "Database temporarily unavailable."}), 503

@app.errorhandler(DAOException)
def handle_generic_dao_error(e: DAOException):
    log_exception(e)
    return jsonify({"error": "Internal database error."}), 500

@app.errorhandler(pydantic.ValidationError)
def handle_pydantic_validation_error(e: pydantic.ValidationError): 
    log_exception(e)
    return jsonify({"error": str(e)}), 400


############################################################
############################################################
@app.post("/api/project/create")
@firebase_token_required(dao)
def create_new_project():
    firebase_token = request.firebase_token
    assert isinstance(firebase_token, FirebaseIdToken)

    data = CreateNewProjectRequest(**request.get_json())

    # insert
    dao.insert_project(user_id=firebase_token.user_id, project_name=data.project_name)
    # success
    return jsonify({"msg": "Project created successfully"}), 200


@app.get("/api/project/get_all")
@firebase_token_required(dao)
def get_all_projects(): 
    firebase_token = request.firebase_token
    assert isinstance(firebase_token, FirebaseIdToken)

    projects = dao.get_all_projects(firebase_token.user_id)
    return jsonify({"projects": [obj.model_dump() for obj in projects]})



@app.post("/api/data_models/create")
@firebase_token_required(dao)
def create_data_model():
    firebase_token = request.firebase_token
    assert isinstance(firebase_token, FirebaseIdToken)

    data = CreateNewDataModelRequest(**request.get_json())
    dao.insert_data_model(user_id=firebase_token.user_id, project_id=data.project_id, data_model_name=data.data_model_name)

    return jsonify({"msg": "Successfully created new data model"})



@app.post("/api/data_models/get_by_id")
@firebase_token_required(dao)
def get_data_model_by_id():
    firebase_token = request.firebase_token
    assert isinstance(firebase_token, FirebaseIdToken)

    data = GetDataModelByIdRequest(**request.get_json())
    dm = dao.get_data_model_by_id(firebase_token.user_id, data_model_id=data.data_model_id)

    return jsonify({"data_model": dm.model_dump()})
    
   
    
    


@app.post("/api/data_models/get_by_project_id")
@firebase_token_required(dao)
def get_data_models_by_project():
    firebase_token = request.firebase_token
    assert isinstance(firebase_token, FirebaseIdToken)

    # get json body
    data = GetDataModelsByProjectIdRequest(**request.get_json())
    data_models = dao.get_data_models_by_project_id(user_id=firebase_token.user_id, project_id=data.project_id)

    return jsonify({"data_models": [dm.model_dump() for dm in data_models]})







@app.post("/api/data_models/create_field")
@firebase_token_required(dao)
def create_data_model_field(): 
    firebase_token = request.firebase_token
    assert isinstance(firebase_token, FirebaseIdToken)


    # get json body
    data = CreateDataModelFieldRequest(**request.get_json())
    field = data.new_field

    dao.insert_data_model_field(user_id=firebase_token.user_id, 
                                data_model_id=data.data_model_id,
                                field_name=field.name,
                                field_type=field.type,
                                field_description=field.description, 
                                )
   
    return jsonify({"msg": "Successfully created new data model field"})






@app.post("/api/data_models/change_field")
@firebase_token_required(dao)
def change_data_model():
    firebase_token = request.firebase_token
    assert isinstance(firebase_token, FirebaseIdToken)

    data = ChangeDataModelFieldRequest(**request.get_json())
    field = data.new_field
    
    dao.change_data_model_field(user_id=firebase_token.user_id, 
                                field_id=field.id, 
                                field_name=field.name, 
                                field_type=field.type, 
                                field_description=field.description)
   
    return jsonify({"msg": "Successfully applied changes to data model field"})





@app.post("/api/data_models/delete_field")
@firebase_token_required(dao)
def delete_data_model_field(): 
    firebase_token = request.firebase_token
    assert isinstance(firebase_token, FirebaseIdToken)

    data = DeleteDataModelFieldRequest(**request.get_json())
    dao.delete_data_model_field(firebase_token.user_id, data.field_id)

    return jsonify({"msg": "Successfully deleted data model field"})



@app.post("/api/data_models/delete")
@firebase_token_required(dao)
def delete_data_model():
    firebase_token = request.firebase_token
    assert isinstance(firebase_token, FirebaseIdToken)

    data = DeleteDataModelRequest(**request.get_json())
    dao.delete_data_model(user_id=firebase_token.user_id, data_model_id=data.data_model_id)

    return jsonify({"msg": "Successfully deleted data model"})





@app.post("/api/workflows/get_by_project_id")
@firebase_token_required(dao)
def get_workflows_by_project():
    firebase_token = request.firebase_token
    assert isinstance(firebase_token, FirebaseIdToken)

    data = GetWorkflowsByProjectIdRequest(**request.get_json())
    workflows = dao.get_workflows_by_project_id(user_id=firebase_token.user_id, project_id=data.project_id)

    return jsonify({"workflows": [w.model_dump() for w in workflows]})



@app.post("/api/llms/get")
@firebase_token_required(dao)
def get_llms():
    firebase_token = request.firebase_token
    assert isinstance(firebase_token, FirebaseIdToken)

    llms = [
        {"id": "001", "name": "default"}
    ]
    return jsonify({"llms": llms})



@app.post("/api/workflows/create")
@firebase_token_required(dao)
def create_workflow():
    firebase_token = request.firebase_token
    assert isinstance(firebase_token, FirebaseIdToken)

    data = CreateWorkflowRequest(**request.get_json())
    workflow_id = dao.create_workflow(firebase_token.user_id, data.project_id, data.llm, data.input_data_model, data.output_data_model, data.active, data.name)
    
    return jsonify({"msg": "Workflow created", "id": workflow_id})



@app.post("/api/workflows/get_by_id")
@firebase_token_required(dao)
def get_workflow_by_id(): 
    firebase_token = request.firebase_token
    assert isinstance(firebase_token, FirebaseIdToken)

    data = GetWorkflowByIdRequest(**request.get_json())
    workflow = dao.get_workflow_by_id(firebase_token.user_id, data.workflow_id)
    
    return jsonify({"workflow": workflow.model_dump()})


@app.post("/api/workflows/security/create_access_token")
@firebase_token_required(dao)
def create_workflow_access_token():
    firebase_token = request.firebase_token
    assert isinstance(firebase_token, FirebaseIdToken)
    
    data = CreateWorkflowApiKeyRequest(**request.get_json())
    api_key = dao.create_workflow_api_key(firebase_token.user_id, data.workflow_id, data.key_name)

    return jsonify({"api_key": api_key})


@app.post("/api/workflows/security/access_tokens_preview")
@firebase_token_required(dao)
def get_workflow_access_tokens_preview():
    firebase_token = request.firebase_token
    assert isinstance(firebase_token, FirebaseIdToken)
    
    data = GetWorkflowAccessTokensPreviewApiKeyRequest(**request.get_json())
    api_keys = dao.get_workflow_api_key_previews(firebase_token.user_id, data.workflow_id)

    return jsonify({"api_keys": [obj.model_dump() for obj in api_keys]})


@app.post("/api/workflows/security/delete_access_token")
@firebase_token_required(dao)
def delete_workflow_access_token():
    firebase_token = request.firebase_token
    assert isinstance(firebase_token, FirebaseIdToken)
    
    data = DeleteWorkflowAccessTokenRequest(**request.get_json())
    dao.delete_workflow_api_key(firebase_token.user_id, data.key_id)

    return jsonify({"msg": "Access Token deleted"})


@app.post("/api/workflows/security/refresh_access_token")
@firebase_token_required(dao)
def refresh_workflow_access_token():
    firebase_token = request.firebase_token
    assert isinstance(firebase_token, FirebaseIdToken)
    
    data = RefreshWorkflowAccessTokenRequest(**request.get_json())
    api_key = dao.refresh_workflow_api_key(firebase_token.user_id, data.key_id)

    return jsonify({"api_key": api_key})



@app.post("/api/auth/check_registration_status")
def check_registration_status(): 
    email = request.get_json().get("email", None)

    if email == None: 
        return jsonify({"msg": "Please provide a valid email address"}), 404
    
    res = supbase_dao.check_registration_status_by_email(email)

    return jsonify(res.model_dump())





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