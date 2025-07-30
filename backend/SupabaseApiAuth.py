import typing
from flask import request, jsonify
from pydantic import BaseModel, Field
from functools import wraps
from flask import Request
import logging
from jose import jwt
import requests
import os
from dotenv import load_dotenv
load_dotenv("./secrets/.env")



class SupabaseJwtDecoded(BaseModel):
    iss: str = Field() 
    aud: str = Field()
    email: str = Field() 
    is_anonymous: bool = Field()
    sub: str = Field()


class SupabaseVerifiedUserResponse(BaseModel): 
    id: str = Field()
    aud: str = Field() 
    email_confirmed_at: str | None = Field()
    is_anonymous: bool = Field()





def verify_jwt_jwks(jwt_token: str):
    jwks_url = f"{os.environ.get("SUPABASE_URL")}/auth/v1/.well-known/jwks.json"
    jwks_response = requests.get(jwks_url)
    jwks = jwks_response.json()

    try:
        decoded = jwt.decode(
            jwt_token, 
            jwks, 
            algorithms=['ES256'],
            audience="authenticated",
            options=dict(require_exp=True)
        )
        return True, decoded
    
    except jwt.JWTError as e:
        return False, None
    except Exception as e: 
        return False, None


def verify_supabase(jwt_token: str): 
    try: 
        res = requests.get(
            f"{os.environ.get("SUPABASE_URL")}/auth/v1/user",
            headers={
                'Authorization': f'Bearer {jwt_token}',
                "apikey": os.environ.get("SUPABASE_ANON_KEY")
            })
    
        if res.status_code == 200: 
            res = res.json()
            return True, res
        else: 
            return False, None

    except Exception as e:
        return False, None


def supabase_token_required():
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            auth_header = request.headers.get("Authorization", None)

            if not auth_header or not auth_header.startswith("Bearer ") or not len(auth_header) > 10:
                return jsonify({"msg": "Authorization header missing or invalid"}), 401

            jwt = auth_header[7:]

            try:
                # 1. JWKS validation 
                is_valid_jwks, decoded_jwt = verify_jwt_jwks(jwt)

                if(not is_valid_jwks or not isinstance(decoded_jwt, dict)): 
                    return jsonify({"msg": "Invalid JWT"}), 401
                
                decoded_jwt = SupabaseJwtDecoded(**decoded_jwt)
                assert isinstance(decoded_jwt, SupabaseJwtDecoded)

                # 2. Supabse endpoint validation
                is_valid_supabase, user_details = verify_supabase(jwt)
                if(not is_valid_supabase or not isinstance(user_details, dict)): 
                    return jsonify({"msg": "Invalid JWT"}), 401
                
                user_details = SupabaseVerifiedUserResponse(**user_details)
                assert isinstance(user_details, SupabaseVerifiedUserResponse)


                assert decoded_jwt.is_anonymous == False and user_details.is_anonymous == False 
                assert decoded_jwt.aud == "authenticated" and user_details.aud == "authenticated"
                assert user_details.email_confirmed_at != None



                # finally, populate the request
                request.decoded_jwt = decoded_jwt
                request.user_details = user_details
                request.jwt = jwt 

            except Exception as e:
                logging.exception(e)
                return jsonify({"msg": "Invalid JWT"}), 401

            return fn(*args, **kwargs)
        return wrapper
    return decorator


def ensure_supabase_auth(request: Request): 
    decoded_jwt = request.decoded_jwt
    user_details = request.user_details
    jwt = request.jwt
    
    assert isinstance(decoded_jwt, SupabaseJwtDecoded)
    assert isinstance(user_details, SupabaseVerifiedUserResponse)
    assert isinstance(jwt, str) and len(request.jwt) > 10

    return decoded_jwt, user_details, jwt