import typing
from flask import request, jsonify
from pydantic import BaseModel
from functools import wraps
from DAO.DAO import DAO
import firebase_admin.auth
import logging


def init_firebase():
    if not firebase_admin._apps:
        cred = firebase_admin.credentials.Certificate("./secrets/firebase-adminsdk.json")
        firebase_admin.initialize_app(cred)

class FirebaseIdToken(BaseModel): 
    iss: str
    aud: str
    auth_time: int 
    user_id: str 
    sub: str
    iat: int 
    exp: int 
    email: str
    email_verified: bool 
    firebase: typing.Dict
    uid: str


def firebase_token_required(dao: DAO):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            auth_header = request.headers.get("Authorization", None)

            if not auth_header or not auth_header.startswith("Bearer "):
                return jsonify({"msg": "Authorization header is missing or invalid"}), 401 # unauthorized

            id_token = auth_header.split(" ")[1]
            try:
                # verify the token
                id_token = firebase_admin.auth.verify_id_token(id_token, check_revoked=True)
                id_token = FirebaseIdToken(**id_token)

                if id_token.email_verified: 
                    request.firebase_token = id_token        

                    if not dao.check_user_exists(id_token.user_id): 
                        dao.insert_user(id_token.user_id)
                else:
                    return jsonify({"msg": "E-Mail not verified"}), 403 # forbidden

            except Exception as e:
                logging.exception(e)
                return jsonify({"msg": "Invalid Token"}), 401 # unauthorized

            return fn(*args, **kwargs)
        return wrapper
    return decorator