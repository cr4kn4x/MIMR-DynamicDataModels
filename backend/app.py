import typing
from pydantic import BaseModel
from flask import Flask, jsonify, request
from flask_cors import CORS


app = Flask(__name__)
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




@app.post("/api/pydantic/validity")
def f():
    payload = request.get_json()
    
    is_valid = CheckDataModelDefinitionValidity(payload["data_model_definition"])

    return jsonify({"is_valid": is_valid})


app.run(debug=True, host="0.0.0.0")
