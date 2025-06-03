import typing, os, uuid
import logging
from pydantic import BaseModel
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from DAO.psqlDAO import PsqlDAO
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity




from dotenv import load_dotenv
load_dotenv(".env")

dao = PsqlDAO(os.getenv("POSTGRES_DSN"))

app = Flask(__name__)

# jwt 
app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY")
jwt = JWTManager(app)

# cors 
CORS(app, origins="*")


class DataModelField(BaseModel):
    name: str
    type: str
    description: str | None
    
class DataModel(BaseModel):
    name: str
    fields: typing.List[DataModelField]


def CheckDataModelDefinitionValidity(data_model_definition: dict):
    try:
        DataModel(data_model_definition)
        return True
    except Exception as e: 
        return False
    return  




@app.post("/register")
def register_user():
    data = request.get_json()

    try:
        username = data["username"]
        password = data["password"]
    except Exception as e: 
        return jsonify({"msg": "invalid request structure"}), 400

    try:
        username_unique = dao.is_username_unique(username)
    except Exception as e: 
        logging.exception(e)
        return jsonify({"msg": "Database error"})
        
    # 
    if not username_unique: 
        return jsonify({"msg": "username is alredy in use"})

    # TBD: Password strength
    # TBD: Limit max length of password and max length of username

    password_hash = generate_password_hash(password)
    user_id = str(uuid.uuid4())

    try:
        insert_user_ok = dao.insertUser(user_id, username, password_hash)
    except Exception as e:
        logging.exception(e)
        return jsonify({"msg": "Database error"})
    
    
    if not insert_user_ok: 
        return jsonify({"msg": "unexpected error occurred. please try again"})

    return jsonify({"msg": "registration successful"})

    

@app.post("/login")
def login_user():
    data = request.json()
    
    try:
        username = data["username"]
        password = data["password"]
    except Exception as e: 
        return jsonify({"msg": "invalid request structure"}), 400
    
    try:
        auth_valid = dao.check_credentials(username=username, password=password)
    except Exception as e:
        return jsonify({"msg": "Database error"})

    if auth_valid: 
        access_token = create_access_token(identity=username)
        return jsonify({"access-token": access_token})
    else: 
        return jsonify({"msg": "unknown error occured!"})



@jwt_required()
def protected():
    user_id = get_jwt_identity()
    return jsonify(logged_in_as=user_id)


@app.post("/api/pydantic/validity")
def f():
    payload = request.get_json()
    
    is_valid = CheckDataModelDefinitionValidity(payload["data_model_definition"])

    return jsonify({"is_valid": is_valid})


app.run(debug=True, host="0.0.0.0")
