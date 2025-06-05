import typing, os, uuid, dotenv, logging, firebase_admin, firebase_admin.auth
from firebase import FirebaseIdToken, firebase_token_required, init_firebase
from functools import wraps
from pydantic import BaseModel
from flask import Flask, jsonify, request
from flask_cors import CORS
from DAO.psqlDAO import PsqlDAO
from InputValidation import InputValidation


dotenv.load_dotenv("./secrets/.env")


app = Flask(__name__)
CORS(app, origins="*")

dao = PsqlDAO(dsn=os.environ.get("POSTGRES_DSN"))

init_firebase()









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

    # check if project already exists
    if dao.check_project_exists(user_id=firebase_token.user_id, project_name=project_name): 
        return jsonify({"msg": f"Project {project_name} already exists"}), 400


    # insert new project
    try:
        dao.insert_new_project(user_id=firebase_token.user_id, project_name=project_name)
    except Exception as e:
        return jsonify({"msg", "Failed to create new project"}), 500

    return jsonify({"msg": "Project created successfully"})




@app.get("/api/project/get_all")
@firebase_token_required(dao)
def get_all_projects(): 
    firebase_token = request.firebase_token
    assert isinstance(firebase_token, FirebaseIdToken)

    projects = dao.get_all_projects(firebase_token.user_id)
    return jsonify(projects)






# app.run(debug=True, host="0.0.0.0")
# flask --app app.py run --debug