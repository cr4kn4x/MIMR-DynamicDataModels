import typing, os, dotenv, logging, pydantic
from firebase import FirebaseIdToken, firebase_token_required, init_firebase
from flask import Flask, jsonify, request
from flask_cors import CORS
from DAO.DAO import DAO, DAOException
from InputValidation import InputValidation
import DAO.ApiInterfaces as Interfaces


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
#                                                       ####
# firebase config                                       ####
init_firebase()                                         ####    
############################################################
############################################################







@app.post("/api/project/create")
@firebase_token_required(dao)
def create_new_project():
    firebase_token = request.firebase_token
    assert isinstance(firebase_token, FirebaseIdToken)

    # get json body
    data = request.get_json()
    project_name = data.get("project_name")

    # validate inputs
    is_valid_project_name, msg = InputValidation.is_valid_project_name(project_name)
    if not is_valid_project_name:
        return jsonify({"msg": msg}), 400

    # try to insert 
    try: 
        dao.insert_project(user_id=firebase_token.user_id, project_name=project_name)
    except DAOException as e: 
        return jsonify({"msg": e.message}), 500
    except Exception as e: 
        return jsonify({"msg": "Datbase Error"}), 500

    # success
    return jsonify({"msg": "Project created successfully"})



@app.get("/api/project/get_all")
@firebase_token_required(dao)
def get_all_projects(): 
    firebase_token = request.firebase_token
    assert isinstance(firebase_token, FirebaseIdToken)

    projects = [ Interfaces.Project(**obj).model_dump() for obj in dao.get_all_projects(firebase_token.user_id) ]
    return jsonify({"projects": projects})



@app.post("/api/data_models/create")
@firebase_token_required(dao)
def create_data_model():
    firebase_token = request.firebase_token
    assert isinstance(firebase_token, FirebaseIdToken)

    # get json body
    data = request.get_json()
    project_id = data.get("project_id")
    data_model_name = data.get("data_model_name")

    # validate inputs
    is_valid_model_name, msg = InputValidation.is_valid_data_model_name(data_model_name)
    if not is_valid_model_name:
        return jsonify({"msg": msg}), 400
    

    # try to insert 
    try: 
        dao.insert_data_model(user_id=firebase_token.user_id, project_id=project_id, data_model_name=data_model_name)
    except DAOException as e: 
        logging.exception(e)
        return jsonify({"msg": str(e)}), 400 
    except Exception as e:
        logging.exception(e)
        return jsonify({"msg": "Failed to create data model"}), 500 
    
    return jsonify({"msg": "Successfully created new data model"})



@app.post("/api/data_models/get_by_project_id")
@firebase_token_required(dao)
def get_data_models_by_project():
    firebase_token = request.firebase_token
    assert isinstance(firebase_token, FirebaseIdToken)
    

    # get json body
    data = request.get_json()
    project_id = data.get("project_id")

    # initialize and guarante datastructure
    data_models = []

    for data_model in dao.get_data_models_by_project_id(user_id=firebase_token.user_id, project_id=project_id): 
        data_model["fields"] = dao.get_data_model_fields_by_id(user_id=firebase_token.user_id, data_model_id=data_model["id"])
        data_model = Interfaces.DataModel(**data_model).model_dump()

        data_models.append(data_model)

    return jsonify({"data_models": data_models})


@app.post("/api/data_models/create_field")
@firebase_token_required(dao)
def create_data_model_field(): 

    firebase_token = request.firebase_token
    assert isinstance(firebase_token, FirebaseIdToken)


     # get json body
    data = request.get_json()
    ass_data_model_id = data.get("ass_data_model_id")
    field = data.get("data_model_field")

    class request_model_field(pydantic.BaseModel):
        name: str
        type: typing.Literal["str", "int", "float"]
        description: typing.Optional[str]
    
    field = request_model_field(**field)


    try:
        dao.insert_data_model_field(user_id=firebase_token.user_id, 
                                    associated_data_model_id=ass_data_model_id,
                                    field_name=field.name,
                                    field_type=field.type,
                                    field_description=field.description, 
                                    )
    except DAOException as e: 
        logging.exception(e)
        return jsonify({"msg": str(e)}), 400
    except Exception as e: 
        logging.exception(e)
        return jsonify({"msg": "Failed to create data model field"}), 500 


    return jsonify({"msg": "Successfully created new data model field"})






@app.post("/api/data_models/change_field")
@firebase_token_required(dao)
def change_data_model(): 

    firebase_token = request.firebase_token
    assert isinstance(firebase_token, FirebaseIdToken)

    data = request.get_json()
    ass_data_model_id = data.get("ass_data_model_id")
    new_field = data.get("new_field")

    try: 
        new_field = Interfaces.DataModelField(**new_field)
    except Exception as e:
        return jsonify({"msg": "new_field is invalid data structure!"}), 400
    
    try:
        dao.change_data_model_field(user_id=firebase_token.user_id, 
                                    associated_data_model_id=ass_data_model_id, 
                                    field_id=new_field.id, 
                                    field_name=new_field.name, 
                                    field_type=new_field.type, 
                                    field_description=new_field.description)
    except DAOException as e: 
        logging.exception(e)
        return jsonify({"msg": str(e)}), 400
    except Exception as e: 
        logging.exception(e)
        return jsonify({"msg": "Failed to apply changes to data model field"}), 500

    return jsonify({"msg": "Successfully applied changes to data model field"})

# app.run(debug=True, host="0.0.0.0")
# flask --app app.py run --debug